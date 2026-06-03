// src/server/api/demoEvents.ts
import { mockEvents } from "@/entities/event/mockEvents";
import type { EventPreview } from "@/entities/event/types";
import type { Locale } from "@/shared/lib/locales";

type GetDemoEventsInput = {
  locale: Locale;
  city?: string;
};

type GetDemoEventsResult = {
  locale: Locale;
  events: EventPreview[];
};

export async function getDemoEvents({
  locale,
  city,
}: GetDemoEventsInput): Promise<GetDemoEventsResult> {
  const events = city
    ? mockEvents.filter(
        (event) => event.city.toLowerCase().replaceAll(" ", "-") === city,
      )
    : mockEvents;

  return {
    locale,
    events,
  };
}
