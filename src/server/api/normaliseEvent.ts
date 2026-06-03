// src/server/api/normaliseEvent.ts
import type { RawEvent } from "@/entities/event/rawEventSchema";
import type { TicketmasterEvent } from "@/entities/event/ticketmasterSchema";
import type { EventCardData } from "@/entities/event/types";
import {
  EVENT_PLACEHOLDER_IMAGE,
  pickBestImage,
} from "@/server/api/pickBestImage";

export function normaliseEvent(rawEvent: RawEvent): EventCardData {
  // UI не знает о raw-структуре. Здесь raw-данные превращаются в стабильную модель.
  return {
    id: rawEvent.id,
    title: rawEvent.name,
    city: rawEvent.location.city,
    country: rawEvent.location.country,
    category: rawEvent.category,
    dateLabel: rawEvent.date.label,
    venue: rawEvent.venue.name,
    description: rawEvent.description,
    imageUrl: rawEvent.image?.url ?? EVENT_PLACEHOLDER_IMAGE,
    priceLabel: rawEvent.price ?? "Price not available",
  };
}

export function normaliseTicketmasterEvent(
  ticketmasterEvent: TicketmasterEvent,
): EventCardData {
  const venue = ticketmasterEvent._embedded?.venues?.[0];
  const classification = ticketmasterEvent.classifications?.[0];
  const category = classification?.segment?.name;
  const genre = classification?.genre?.name;
  const firstPriceRange = ticketmasterEvent.priceRanges?.[0];
  const description =
    ticketmasterEvent.info?.trim() ||
    ticketmasterEvent.pleaseNote?.trim() ||
    "Event details are coming soon.";

  // Ticketmaster-ответ остаётся на server/api границе.
  // UI получает только внутреннюю модель EventCardData.
  return {
    id: ticketmasterEvent.id,
    title: ticketmasterEvent.name,
    city: venue?.city?.name ?? "Unknown city",
    country: venue?.country?.name ?? "Unknown country",
    category: category ?? "Event",
    dateLabel: ticketmasterEvent.dates?.start?.localDate ?? "Date TBA",
    venue: venue?.name ?? "Venue TBA",
    description,
    imageUrl: pickBestImage(ticketmasterEvent.images),
    genreLabel: genre,
    priceLabel: firstPriceRange?.min
      ? `from ${firstPriceRange.min} ${firstPriceRange.currency ?? ""}`.trim()
      : "Free",
    ticketUrl: ticketmasterEvent.url,
    timeLabel: ticketmasterEvent.dates?.start?.localTime?.slice(0, 5),
  };
}
