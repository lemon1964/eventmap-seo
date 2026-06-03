// src/server/api/staticEventParams.ts
import { getControlledEventIds } from "@/server/api/controlledEvents";
import { locales, type Locale } from "@/shared/lib/locales";

export type StaticEventParams = {
  locale: Locale;
  id: string;
};

export function getStaticEventParams(): StaticEventParams[] {
  const eventIds = getControlledEventIds();

  return locales.flatMap((locale) =>
    eventIds.map((id) => ({
      locale,
      id,
    })),
  );
}
