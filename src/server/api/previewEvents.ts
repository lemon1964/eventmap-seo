// src/server/api/previewEvents.ts
import { controlledEventCards } from "@/entities/event/controlledEvents";
import type { EventCardData } from "@/entities/event/types";
import { cachePolicy } from "@/server/cache/cachePolicy";
import type { Locale } from "@/shared/lib/locales";

export async function getPreviewEvents({
  locale,
}: {
  locale: Locale;
}): Promise<EventCardData[]> {
  // Preview-сценарий не должен имитировать долгий кэш.
  // В реальном fetch здесь использовался бы cache: "no-store".
  void locale;

  return controlledEventCards.slice(0, 2);
}

export function getPreviewCacheMode() {
  return cachePolicy.previewNoStore;
}
