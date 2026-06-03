// src/features/favorites/favoritesStorage.ts
import type { EventCardData } from "@/entities/event/types";

export const FAVORITES_STORAGE_KEY = "eventmap:favorites";
export const FAVORITE_EVENTS_STORAGE_KEY = "eventmap:favorite-events";

type FavoriteEventsMap = Record<string, EventCardData>;

export function normaliseFavoriteIds(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const ids = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);

  return Array.from(new Set(ids));
}

export function parseFavoriteIds(value: string | null): string[] {
  if (!value) {
    return [];
  }

  try {
    return normaliseFavoriteIds(JSON.parse(value));
  } catch {
    return [];
  }
}

export function stringifyFavoriteIds(ids: string[]): string {
  return JSON.stringify(normaliseFavoriteIds(ids));
}

function isEventCardData(value: unknown): value is EventCardData {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const event = value as Partial<EventCardData>;

  return (
    typeof event.id === "string" &&
    typeof event.title === "string" &&
    typeof event.city === "string" &&
    typeof event.country === "string" &&
    typeof event.category === "string" &&
    typeof event.dateLabel === "string" &&
    typeof event.venue === "string" &&
    typeof event.description === "string" &&
    typeof event.imageUrl === "string"
  );
}

export function parseFavoriteEvents(value: string | null): FavoriteEventsMap {
  if (!value) {
    return {};
  }

  try {
    const parsed: unknown = JSON.parse(value);

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed).flatMap(([id, event]) =>
        isEventCardData(event) ? [[id, event]] : [],
      ),
    );
  } catch {
    return {};
  }
}

export function stringifyFavoriteEvents(events: FavoriteEventsMap): string {
  return JSON.stringify(events);
}
