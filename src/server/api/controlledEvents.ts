// src/server/api/controlledEvents.ts
import { controlledEventCards } from "@/entities/event/controlledEvents";
import type { EventCardData } from "@/entities/event/types";
import type { Locale } from "@/shared/lib/locales";

export function getControlledEventIds(): string[] {
  return controlledEventCards.map((event) => event.id);
}

export async function getControlledFeaturedEvents({
  locale,
}: {
  locale: Locale;
}): Promise<EventCardData[]> {
  // Locale остаётся частью server/data контракта.
  // Controlled content пока общий для en и ru.
  void locale;

  return controlledEventCards;
}

export async function getControlledEventById({
  id,
  locale,
}: {
  id: string;
  locale: Locale;
}): Promise<EventCardData | null> {
  // Detail page строится из предсказуемого источника, а не из live API.
  void locale;

  return controlledEventCards.find((event) => event.id === id) ?? null;
}
