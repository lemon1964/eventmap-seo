// src/server/api/ticketmaster.ts
import type { Locale } from "@/shared/lib/locales";
import type { TicketmasterEvent } from "@/entities/event/ticketmasterSchema";
import type { SearchFilters } from "@/entities/search/searchFilters";
import {
  getTicketmasterCategoryLabel,
  slugToLabel,
} from "@/entities/search/searchFilters";

const TICKETMASTER_EVENTS_URL =
  "https://app.ticketmaster.com/discovery/v2/events.json";
const TICKETMASTER_EVENT_DETAIL_URL =
  "https://app.ticketmaster.com/discovery/v2/events/";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function getLiveEventsStartDate(): Date {
  const date = new Date(Date.now() - ONE_DAY_MS);
  date.setUTCHours(0, 0, 0, 0);

  return date;
}

function toTicketmasterDateTime(date: Date): string {
  return date.toISOString().replace(".000", "");
}

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function getLiveEventsStartDateTime(): string {
  return toTicketmasterDateTime(getLiveEventsStartDate());
}

export function isTicketmasterEventOnOrAfterStartDate(
  event: TicketmasterEvent,
): boolean {
  const localDate = event.dates?.start?.localDate;

  if (!localDate) {
    return false;
  }

  return localDate >= toDateKey(getLiveEventsStartDate());
}

type BuildEventsUrlInput = {
  apiKey: string;
  locale: Locale;
  city?: string;
  keyword?: string;
};

export function buildEventsUrl({
  apiKey,
  locale,
  city,
  keyword,
}: BuildEventsUrlInput): string {
  void locale;

  const url = new URL(TICKETMASTER_EVENTS_URL);

  url.searchParams.set("apikey", apiKey);
  url.searchParams.set("size", "12");
  url.searchParams.set("sort", "date,asc");
  url.searchParams.set("locale", "*");
  url.searchParams.set("startDateTime", getLiveEventsStartDateTime());

  if (city) {
    url.searchParams.set("city", city);
  }

  if (keyword) {
    url.searchParams.set("keyword", keyword);
  }

  return url.toString();
}

type BuildTicketmasterSearchUrlInput = {
  apiKey: string;
  filters: SearchFilters;
  locale: Locale;
  pageSize: number;
};

export function buildTicketmasterSearchUrl({
  apiKey,
  filters,
  locale,
  pageSize,
}: BuildTicketmasterSearchUrlInput): string {
  void locale;

  const url = new URL(TICKETMASTER_EVENTS_URL);

  url.searchParams.set("apikey", apiKey);
  url.searchParams.set("size", String(pageSize));
  url.searchParams.set("page", String(Math.max(filters.page - 1, 0)));
  url.searchParams.set("sort", "date,asc");
  url.searchParams.set("locale", "*");
  url.searchParams.set("startDateTime", getLiveEventsStartDateTime());

  if (filters.city) {
    url.searchParams.set("city", slugToLabel(filters.city));
  }

  if (filters.q) {
    url.searchParams.set("keyword", filters.q);
  }

  if (filters.category) {
    url.searchParams.set(
      "classificationName",
      getTicketmasterCategoryLabel(filters.category),
    );
  }

  return url.toString();
}

type BuildEventByIdUrlInput = {
  apiKey: string;
  id: string;
  locale: Locale;
};

export function buildEventByIdUrl({
  apiKey,
  id,
  locale,
}: BuildEventByIdUrlInput): string {
  void locale;

  const url = new URL(
    `${encodeURIComponent(id)}.json`,
    TICKETMASTER_EVENT_DETAIL_URL,
  );

  url.searchParams.set("apikey", apiKey);
  url.searchParams.set("locale", "*");

  return url.toString();
}
