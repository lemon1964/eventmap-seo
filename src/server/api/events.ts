// src/server/api/events.ts
import { rawMockEvents } from "@/entities/event/rawMockEvents";
import { RawEventSchema } from "@/entities/event/rawEventSchema";
import {
  TicketmasterEventSchema,
  TicketmasterEventsResponseSchema,
} from "@/entities/event/ticketmasterSchema";
import type { EventCardData } from "@/entities/event/types";
import {
  getControlledEventById,
  getControlledFeaturedEvents,
} from "@/server/api/controlledEvents";
import {
  buildEventByIdUrl,
  buildEventsUrl,
  isTicketmasterEventOnOrAfterStartDate,
} from "@/server/api/ticketmaster";
import { getTicketmasterApiKey } from "@/server/env";
import {
  normaliseEvent,
  normaliseTicketmasterEvent,
} from "@/server/api/normaliseEvent";
import type { Locale } from "@/shared/lib/locales";
import { cachePolicy } from "@/server/cache/cachePolicy";
import { searchCategories } from "@/entities/search/searchFilters";
import { searchLiveEvents } from "@/server/api/searchEvents";
import { controlledEventCards } from "@/entities/event/controlledEvents";

const FAVORITE_EVENTS_LIMIT = 50;

type GetFeaturedEventsInput = {
  locale: Locale;
};

export type FeaturedEventsResult = {
  source: "controlled";
  events: EventCardData[];
};

export type LiveHomeEventsResult = {
  source: "ticketmaster" | "fallback";
  events: EventCardData[];
};

export type RawEventCheckResult = {
  index: number;
  status: "accepted" | "rejected";
  label: string;
  reason: string;
};

export type HomeEventsResult = {
  source: "ticketmaster" | "controlled";
  events: EventCardData[];
};

export function getFallbackFeaturedEvents(): EventCardData[] {
  return rawMockEvents.flatMap((rawEvent) => {
    const parsed = RawEventSchema.safeParse(rawEvent);

    if (!parsed.success) {
      return [];
    }

    return [normaliseEvent(parsed.data)];
  });
}

export async function getHomeEvents({
  locale,
}: GetFeaturedEventsInput): Promise<HomeEventsResult> {
  const liveEvents = await getLiveTicketmasterEvents({ locale });

  if (liveEvents.length > 0) {
    return {
      source: "ticketmaster",
      events: liveEvents,
    };
  }

  return {
    source: "controlled",
    events: await getControlledFeaturedEvents({ locale }),
  };
}


export async function getFeaturedEvents({
  locale,
}: GetFeaturedEventsInput): Promise<FeaturedEventsResult> {
  const events = await getControlledFeaturedEvents({ locale });

  return {
    source: "controlled",
    events,
  };
}

export async function getLiveTicketmasterEvents({
  locale,
}: GetFeaturedEventsInput): Promise<EventCardData[]> {
  const apiKey = getTicketmasterApiKey();

  if (!apiKey) {
    return [];
  }

  try {
    const url = buildEventsUrl({ apiKey, locale });
    const response = await fetch(url, {
      next: {
        revalidate: cachePolicy.liveEventsRevalidate,
        tags: [cachePolicy.tags.liveEvents],
      },
    });
    

    if (!response.ok) {
      console.warn("Ticketmaster request failed", response.status);
      return [];
    }

    const data: unknown = await response.json();
    const parsed = TicketmasterEventsResponseSchema.safeParse(data);

    if (!parsed.success) {
      console.warn("Ticketmaster response shape is invalid");
      return [];
    }

    const events = (parsed.data._embedded?.events ?? []).filter(
      isTicketmasterEventOnOrAfterStartDate,
    );
    const normalisedEvents = events.map(normaliseTicketmasterEvent);

    return normalisedEvents;
  } catch {
    console.warn("Ticketmaster request failed before fallback");
    return [];
  }
}

export async function getLiveHomeEvents({
  locale,
}: GetFeaturedEventsInput): Promise<LiveHomeEventsResult> {
  const liveEvents = await getLiveTicketmasterEvents({ locale });

  if (liveEvents.length > 0) {
    return {
      source: "ticketmaster",
      events: liveEvents,
    };
  }

  return {
    source: "fallback",
    events: getFallbackFeaturedEvents(),
  };
}

export async function getRawEventCheckResults({
  locale,
}: GetFeaturedEventsInput): Promise<RawEventCheckResult[]> {
  void locale;

  return rawMockEvents.map((rawEvent, index) => {
    const parsed = RawEventSchema.safeParse(rawEvent);

    if (parsed.success) {
      return {
        index,
        status: "accepted",
        label: parsed.data.name,
        reason: "Accepted by RawEventSchema",
      };
    }

    return {
      index,
      status: "rejected",
      label: `Raw item ${index + 1}`,
      reason: parsed.error.issues
        .map((issue) => issue.path.join(".") || "root")
        .join(", "),
    };
  });
}

export async function fetchEventById({
  id,
  locale,
}: {
  id: string;
  locale: Locale;
}): Promise<EventCardData | null> {
  const controlledEvent = await getControlledEventById({ id, locale });

  if (controlledEvent) {
    return controlledEvent;
  }

  return fetchLiveTicketmasterEventById({ id, locale });
}

export async function getEventsByIds({
  ids,
  locale,
}: {
  ids: string[];
  locale: Locale;
}): Promise<EventCardData[]> {
  const uniqueIds = Array.from(
    new Set(ids.map((id) => id.trim()).filter(Boolean)),
  ).slice(0, FAVORITE_EVENTS_LIMIT);

  const events = await Promise.all(
    uniqueIds.map((id) => fetchEventById({ id, locale })),
  );

  return events.flatMap((event) => (event ? [event] : []));
}


export async function fetchLiveTicketmasterEventById({
  id,
  locale,
}: {
  id: string;
  locale: Locale;
}): Promise<EventCardData | null> {
  const apiKey = getTicketmasterApiKey();

  if (!apiKey) {
    return null;
  }

  try {
    const url = buildEventByIdUrl({ apiKey, id, locale });
    const response = await fetch(url, {
      next: {
        revalidate: cachePolicy.liveEventDetailRevalidate,
        tags: [
          cachePolicy.tags.liveEventDetail,
          `${cachePolicy.tags.liveEventDetail}:${id}`,
        ],
      },
    });    

    if (!response.ok) {
      console.warn("Ticketmaster detail request failed", response.status);
      return null;
    }

    const data: unknown = await response.json();
    const parsed = TicketmasterEventSchema.safeParse(data);

    if (!parsed.success) {
      console.warn("Ticketmaster detail response shape is invalid");
      return null;
    }

    return normaliseTicketmasterEvent(parsed.data);
  } catch {
    console.warn("Ticketmaster detail request failed before fallback");
    return null;
  }
}

function isSimilarEvent({
  currentEvent,
  event,
}: {
  currentEvent: EventCardData;
  event: EventCardData;
}): boolean {
  if (event.id === currentEvent.id) {
    return false;
  }

  return (
    event.category.toLowerCase() === currentEvent.category.toLowerCase() ||
    event.city.toLowerCase() === currentEvent.city.toLowerCase()
  );
}

function getCategorySlug(category: string): string {
  const match = searchCategories.find(
    (item) => item.ticketmasterLabel.toLowerCase() === category.toLowerCase(),
  );

  return match?.slug ?? category.toLowerCase();
}

async function getLiveSimilarEvents({
  currentEvent,
  locale,
  limit,
}: {
  currentEvent: EventCardData;
  locale: Locale;
  limit: number;
}): Promise<EventCardData[]> {
  const liveResult = await searchLiveEvents({
    filters: {
      category: getCategorySlug(currentEvent.category),
      city: "",
      page: 1,
      q: "",
    },
    locale,
    pageSize: limit + 1,
  });

  if (!liveResult.ok) {
    return [];
  }

  return liveResult.events
    .filter((event) => event.id !== currentEvent.id)
    .slice(0, limit);
}

export async function getSimilarEvents({
  currentEvent,
  locale,
  limit = 4,
}: {
  currentEvent: EventCardData;
  locale: Locale;
  limit?: number;
}): Promise<EventCardData[]> {
  const liveEvents = await getLiveSimilarEvents({
    currentEvent,
    locale,
    limit,
  });

  if (liveEvents.length > 0) {
    return liveEvents;
  }

  return controlledEventCards
    .filter((event) => isSimilarEvent({ currentEvent, event }))
    .slice(0, limit);
}

