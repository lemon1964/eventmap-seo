// src/entities/seo/seoPaths.ts
import type { SearchFilters } from "@/entities/search/searchFilters";
import { buildSearchHref } from "@/entities/search/searchFilters";
import type { Locale } from "@/shared/lib/locales";
import { locales } from "@/shared/lib/locales";
import { routes } from "@/shared/lib/routes";

export type SeoPaths = {
  canonicalPath: string;
  languageAlternates: Record<Locale, string>;
};

function buildLocalizedAlternates(
  getPath: (locale: Locale) => string,
): Record<Locale, string> {
  return Object.fromEntries(
    locales.map((locale) => [locale, getPath(locale)]),
  ) as Record<Locale, string>;
}

export function buildHomeSeoPaths(locale: Locale): SeoPaths {
  return {
    canonicalPath: routes.home(locale),
    languageAlternates: buildLocalizedAlternates(routes.home),
  };
}

export function buildSearchSeoPaths({
  filters,
  locale,
}: {
  filters: SearchFilters;
  locale: Locale;
}): SeoPaths {
  const getPath = (targetLocale: Locale) =>
    buildSearchHref({ filters, locale: targetLocale });

  return {
    canonicalPath: getPath(locale),
    languageAlternates: buildLocalizedAlternates(getPath),
  };
}

export function buildFavoritesSeoPaths(locale: Locale): SeoPaths {
  return {
    canonicalPath: routes.favorites(locale),
    languageAlternates: buildLocalizedAlternates(routes.favorites),
  };
}

export function buildEventSeoPaths({
  id,
  locale,
}: {
  id: string;
  locale: Locale;
}): SeoPaths {
  const getPath = (targetLocale: Locale) => routes.eventDetail(targetLocale, id);

  return {
    canonicalPath: getPath(locale),
    languageAlternates: buildLocalizedAlternates(getPath),
  };
}
