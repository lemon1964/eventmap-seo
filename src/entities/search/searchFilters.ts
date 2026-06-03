// src/entities/search/searchFilters.ts
import type { Locale } from "@/shared/lib/locales";

export type SearchFilters = {
  category: string;
  city: string;
  q: string;
  page: number;
};

type SearchParamsInput = Record<string, string | string[] | undefined>;

export type SearchCategory = {
  slug: string;
  icon: string;
  label: Record<Locale, string>;
  ticketmasterLabel: string;
};

export const searchCategories: SearchCategory[] = [
  {
    slug: "music",
    icon: "🎵",
    label: { en: "Music", ru: "Музыка" },
    ticketmasterLabel: "Music",
  },
  {
    slug: "sports",
    icon: "⚽",
    label: { en: "Sports", ru: "Спорт" },
    ticketmasterLabel: "Sports",
  },
  {
    slug: "arts",
    icon: "🎭",
    label: { en: "Arts & Theatre", ru: "Театр" },
    ticketmasterLabel: "Arts & Theatre",
  },
  {
    slug: "film",
    icon: "🎬",
    label: { en: "Film", ru: "Кино" },
    ticketmasterLabel: "Film",
  },
];

export const knownCategories = [
  ...searchCategories.map((category) => category.slug),
  "family",
  "design",
  "food",
  "art",
];
export const knownCities = ["london", "berlin", "new-york"];

function firstValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

export function normaliseSearchValue(value: string): string {
  return value.trim().toLowerCase();
}

function normalisePage(value: string): number {
  const page = Number.parseInt(value, 10);

  return Number.isFinite(page) && page > 0 ? page : 1;
}

export function slugToLabel(value: string): string {
  if (value === "arts") {
    return "Arts & Theatre";
  }

  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getSearchCategoryLabel({
  category,
  locale,
}: {
  category: string;
  locale: Locale;
}): string {
  const productCategory = searchCategories.find(
    (item) => item.slug === category,
  );

  return productCategory?.label[locale] ?? slugToLabel(category);
}

export function getTicketmasterCategoryLabel(category: string): string {
  const productCategory = searchCategories.find(
    (item) => item.slug === category,
  );

  return productCategory?.ticketmasterLabel ?? slugToLabel(category);
}

export function parseSearchParams(
  searchParams: SearchParamsInput,
): SearchFilters {
  return {
    category: normaliseSearchValue(firstValue(searchParams.category)),
    city: normaliseSearchValue(firstValue(searchParams.city)),
    q: normaliseSearchValue(firstValue(searchParams.q)),
    page: normalisePage(firstValue(searchParams.page)),
  };
}

export function parseSearchSegments(segments?: string[]): Partial<SearchFilters> {
  const filters: Partial<SearchFilters> = {};

  for (const segment of segments ?? []) {
    const value = normaliseSearchValue(segment);

    if (!filters.category && knownCategories.includes(value)) {
      filters.category = value;
      continue;
    }

    if (!filters.city && knownCities.includes(value)) {
      filters.city = value;
    }
  }

  return filters;
}

export function parseSearchInput({
  searchParams,
  segments,
}: {
  searchParams: SearchParamsInput;
  segments?: string[];
}): SearchFilters {
  const queryFilters = parseSearchParams(searchParams);
  const segmentFilters = parseSearchSegments(segments);

  return {
    category: segmentFilters.category ?? queryFilters.category,
    city: segmentFilters.city ?? queryFilters.city,
    q: queryFilters.q,
    page: queryFilters.page,
  };
}

export function hasSearchFilters(filters: SearchFilters): boolean {
  return Boolean(
    filters.category || filters.city || filters.q || filters.page > 1,
  );
}

export function buildSearchHref({
  locale,
  filters,
}: {
  locale: Locale;
  filters: Partial<SearchFilters>;
}): string {
  const params = new URLSearchParams();
  const cleanParts = [filters.category, filters.city].filter(Boolean);

  if (filters.q) {
    params.set("q", filters.q);
  }

  if (filters.page && filters.page > 1) {
    params.set("page", String(filters.page));
  }

  const query = params.toString();
  const path =
    cleanParts.length > 0
      ? `/${locale}/search/${cleanParts.join("/")}`
      : `/${locale}/search`;

  return query ? `${path}?${query}` : path;
}

