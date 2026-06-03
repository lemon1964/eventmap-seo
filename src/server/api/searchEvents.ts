// src/server/api/searchEvents.ts
import { controlledEventCards } from "@/entities/event/controlledEvents";
import { TicketmasterEventsResponseSchema } from "@/entities/event/ticketmasterSchema";
import type { EventCardData } from "@/entities/event/types";
import type { SearchFilters } from "@/entities/search/searchFilters";
import { slugToLabel } from "@/entities/search/searchFilters";
import { cachePolicy } from "@/server/cache/cachePolicy";
import { getTicketmasterApiKey } from "@/server/env";
import { normaliseTicketmasterEvent } from "@/server/api/normaliseEvent";
import {
  buildTicketmasterSearchUrl,
  isTicketmasterEventOnOrAfterStartDate,
} from "@/server/api/ticketmaster";
import type { Locale } from "@/shared/lib/locales";

export const SEARCH_PAGE_SIZE = 20;

export type SearchPaginationResult = {
  events: EventCardData[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type SearchSourceType = "live" | "fallback";

export type SearchSourceReason =
  | "live-results"
  | "missing-api-key"
  | "api-error"
  | "empty-live-response"
  | "invalid-live-response"
  | "empty-normalised-response"
  | "controlled-fallback";

export type SearchSourceInfo = {
  type: SearchSourceType;
  label: string;
  reason: string;
  reasonKey: SearchSourceReason;
};

export type SearchPageEventsResult = SearchPaginationResult & {
  source: SearchSourceInfo;
};

type LiveSearchResult =
  | {
      ok: true;
      events: EventCardData[];
      totalCount: number;
      totalPages: number;
      currentPage: number;
    }
  | {
      ok: false;
      reasonKey: Exclude<SearchSourceReason, "live-results" | "controlled-fallback">;
    };

const sourceText: Record<SearchSourceReason, string> = {
  "live-results": "Ticketmaster returned live events for this URL.",
  "missing-api-key": "Ticketmaster API key is missing.",
  "api-error": "Ticketmaster request failed, so EventMap used controlled fallback.",
  "empty-live-response":
    "Ticketmaster returned an empty response, so EventMap used controlled fallback.",
  "invalid-live-response":
    "Ticketmaster response shape was invalid, so EventMap used controlled fallback.",
  "empty-normalised-response":
    "Ticketmaster events could not be normalised, so EventMap used controlled fallback.",
  "controlled-fallback": "Controlled fallback keeps search working without live data.",
};

function getSourceInfo({
  type,
  reasonKey,
}: {
  type: SearchSourceType;
  reasonKey: SearchSourceReason;
}): SearchSourceInfo {
  return {
    type,
    reasonKey,
    label: type === "live" ? "Live Ticketmaster results" : "Controlled fallback",
    reason: sourceText[reasonKey],
  };
}

function includesValue(source: string, value: string): boolean {
  return source.toLowerCase().includes(value);
}

function matchesCategory(event: EventCardData, category: string): boolean {
  if (!category) {
    return true;
  }

  const categoryLabel = slugToLabel(category).toLowerCase();

  return (
    event.category.toLowerCase() === categoryLabel ||
    (category === "arts" &&
      event.category.toLowerCase() === "arts & theatre")
  );
}

function matchesCity(event: EventCardData, city: string): boolean {
  if (!city) {
    return true;
  }

  return event.city.toLowerCase() === slugToLabel(city).toLowerCase();
}

function matchesQuery(event: EventCardData, q: string): boolean {
  if (!q) {
    return true;
  }

  return [
    event.title,
    event.description,
    event.venue,
    event.city,
    event.category,
  ].some((field) => includesValue(field, q));
}

export async function searchControlledEvents({
  filters,
}: {
  filters: SearchFilters;
}): Promise<EventCardData[]> {
  return controlledEventCards.filter(
    (event) =>
      matchesCategory(event, filters.category) &&
      matchesCity(event, filters.city) &&
      matchesQuery(event, filters.q),
  );
}

export function paginateEvents({
  events,
  page,
  pageSize = SEARCH_PAGE_SIZE,
}: {
  events: EventCardData[];
  page: number;
  pageSize?: number;
}): SearchPaginationResult {
  const totalCount = events.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * pageSize;
  const paginatedEvents = events.slice(start, start + pageSize);

  return {
    events: paginatedEvents,
    totalCount,
    totalPages,
    currentPage,
    hasPreviousPage: currentPage > 1,
    hasNextPage: currentPage < totalPages,
  };
}

export async function searchLiveEvents({
  filters,
  locale,
  pageSize = SEARCH_PAGE_SIZE,
}: {
  filters: SearchFilters;
  locale: Locale;
  pageSize?: number;
}): Promise<LiveSearchResult> {
  const apiKey = getTicketmasterApiKey();

  if (!apiKey) {
    return { ok: false, reasonKey: "missing-api-key" };
  }

  try {
    const url = buildTicketmasterSearchUrl({
      apiKey,
      filters,
      locale,
      pageSize,
    });
    const response = await fetch(url, {
      next: {
        revalidate: cachePolicy.liveEventsRevalidate,
        tags: [cachePolicy.tags.liveEvents],
      },
    });

    if (!response.ok) {
      console.warn("Ticketmaster search request failed", response.status);
      return { ok: false, reasonKey: "api-error" };
    }

    const data: unknown = await response.json();
    const parsed = TicketmasterEventsResponseSchema.safeParse(data);

    if (!parsed.success) {
      console.warn("Ticketmaster search response shape is invalid");
      return { ok: false, reasonKey: "invalid-live-response" };
    }

    const rawEvents = (parsed.data._embedded?.events ?? []).filter(
      isTicketmasterEventOnOrAfterStartDate,
    );

    if (rawEvents.length === 0) {
      return { ok: false, reasonKey: "empty-live-response" };
    }

    const events = rawEvents.map(normaliseTicketmasterEvent);

    if (events.length === 0) {
      return { ok: false, reasonKey: "empty-normalised-response" };
    }

    const totalCount = parsed.data.page?.totalElements ?? events.length;
    const totalPages = Math.max(
      1,
      parsed.data.page?.totalPages ?? Math.ceil(totalCount / pageSize),
    );
    const currentPage = Math.min(Math.max(filters.page, 1), totalPages);

    return {
      ok: true,
      events,
      totalCount,
      totalPages,
      currentPage,
    };
  } catch {
    console.warn("Ticketmaster search request failed before fallback");
    return { ok: false, reasonKey: "api-error" };
  }
}

export async function getSearchPageEvents({
  filters,
  locale,
}: {
  filters: SearchFilters;
  locale: Locale;
}): Promise<SearchPageEventsResult> {
  const liveResult = await searchLiveEvents({ filters, locale });

  if (liveResult.ok) {
    return {
      ...liveResult,
      hasPreviousPage: liveResult.currentPage > 1,
      hasNextPage: liveResult.currentPage < liveResult.totalPages,
      source: getSourceInfo({ type: "live", reasonKey: "live-results" }),
    };
  }

  const filteredEvents = await searchControlledEvents({ filters });
  const pagination = paginateEvents({
    events: filteredEvents,
    page: filters.page,
  });

  return {
    ...pagination,
    source: getSourceInfo({ type: "fallback", reasonKey: liveResult.reasonKey }),
  };
}
