// src/entities/seo/pageMetadata.ts
import type { Locale } from "@/shared/lib/locales";
import { toNextMetadata } from "@/entities/seo/toNextMetadata";

export function getDefaultPageMetadata(locale: Locale) {
  return toNextMetadata({
    title: "EventMap",
    description:
      locale === "ru"
        ? "Ищите концерты, спорт, театр, кино и живые события рядом."
        : "Find concerts, sports, theatre, film and live events near you.",
  });
}

export function getEventNotFoundMetadata(locale: Locale) {
  return toNextMetadata({
    title: locale === "ru" ? "Событие не найдено" : "Event not found",
    description:
      locale === "ru"
        ? "EventMap could not find this event."
        : "EventMap could not find this event.",
    noIndex: true,
  });
}
