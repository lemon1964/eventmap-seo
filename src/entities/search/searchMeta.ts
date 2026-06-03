// src/entities/search/searchMeta.ts
import type { Locale } from "@/shared/lib/locales";
import {
  buildSearchHref,
  slugToLabel,
  type SearchFilters,
} from "@/entities/search/searchFilters";

export type SearchIndexPolicy = {
  shouldIndex: boolean;
  label: string;
  reason: string;
};

export type SearchMeta = {
  title: string;
  description: string;
  h1: string;
  intro: string;
  resultLabel: string;
  canonicalPreview: string;
  cleanUrlPreview: string;
  indexPolicy: SearchIndexPolicy;
};

type BuildSearchMetaInput = {
  filters: SearchFilters;
  locale: Locale;
  totalCount: number;
  currentPage: number;
  totalPages: number;
};

function getPageNote({
  currentPage,
  requestedPage,
  totalPages,
}: {
  currentPage: number;
  requestedPage: number;
  totalPages: number;
}): string {
  if (requestedPage > totalPages) {
    return ` Requested page ${requestedPage} is outside the available range; EventMap shows page ${currentPage} of ${totalPages}.`;
  }

  return requestedPage > 1 ? ` Page ${currentPage} of ${totalPages}.` : "";
}

function getResultLabel(totalCount: number): string {
  return `${totalCount} ${totalCount === 1 ? "event" : "events"}`;
}

function buildIntro({
  baseIntro,
  currentPage,
  requestedPage,
  totalCount,
  totalPages,
}: {
  baseIntro: string;
  currentPage: number;
  requestedPage: number;
  totalCount: number;
  totalPages: number;
}): string {
  if (totalCount === 0) {
    return "No matching controlled events were found for this URL. Empty search result pages are often thin content, so EventMap marks them as noindex preview.";
  }

  return `${baseIntro}${getPageNote({
    currentPage,
    requestedPage,
    totalPages,
  })}`;
}

function buildIndexPolicy({
  filters,
  totalCount,
  totalPages,
}: {
  filters: SearchFilters;
  totalCount: number;
  totalPages: number;
}): SearchIndexPolicy {
  const hasLandingFilter = Boolean(filters.category || filters.city);
  const isQueryOnly = Boolean(filters.q && !hasLandingFilter);
  const isOutOfRange = filters.page > totalPages;

  if (totalCount === 0) {
    return {
      shouldIndex: false,
      label: "Noindex preview",
      reason:
        "This URL has no matching controlled events, so it looks like thin content.",
    };
  }

  if (isQueryOnly) {
    return {
      shouldIndex: false,
      label: "Noindex preview",
      reason:
        "This URL is query-only. EventMap keeps it useful for users but does not treat it as a crawlable landing page.",
    };
  }

  if (isOutOfRange) {
    return {
      shouldIndex: false,
      label: "Noindex preview",
      reason:
        "The requested page is outside the available result range, so it is a weak landing page candidate.",
    };
  }

  if (hasLandingFilter) {
    return {
      shouldIndex: true,
      label: "Index preview",
      reason:
        "This URL has a category or city and returns matching controlled events.",
    };
  }

  return {
    shouldIndex: false,
    label: "Noindex preview",
    reason:
      "The base search route is useful for navigation, but it is too broad for an indexable landing page.",
  };
}

export function buildSearchMeta({
  filters,
  locale,
  totalCount,
  currentPage,
  totalPages,
}: BuildSearchMetaInput): SearchMeta {
  const category = filters.category ? slugToLabel(filters.category) : "";
  const city = filters.city ? slugToLabel(filters.city) : "";
  const query = filters.q;
  const requestedPage = filters.page;
  const pageTitleNote = requestedPage > 1 ? `, page ${requestedPage}` : "";
  const pageDescriptionNote = getPageNote({
    currentPage,
    requestedPage,
    totalPages,
  });
  const resultLabel = getResultLabel(totalCount);
  const canonicalPreview = buildSearchHref({ filters, locale });
  const cleanUrlPreview = buildSearchHref({ filters, locale });

  let h1 = locale === "ru" ? "Search events" : "Search events";
  let description =
    "Server-rendered search across controlled EventMap events with URL filters.";
  let intro =
    "Browse controlled EventMap events with server-rendered filters.";

  if (category && city && query) {
    h1 = `${category} events in ${city} for "${query}"`;
    description = `Find ${category} events in ${city} matching "${query}" with server-rendered EventMap results.${pageDescriptionNote}`;
    intro = buildIntro({
      baseIntro: `Browse ${category} events in ${city} that match "${query}" with server-rendered results.`,
      currentPage,
      requestedPage,
      totalCount,
      totalPages,
    });
  } else if (category && city) {
    h1 = `${category} events in ${city}`;
    description = `Browse ${category} events in ${city} with server-rendered EventMap results.${pageDescriptionNote}`;
    intro = buildIntro({
      baseIntro: `Browse ${category} events in ${city} with server-rendered results.`,
      currentPage,
      requestedPage,
      totalCount,
      totalPages,
    });
  } else if (category) {
    h1 = `${category} events`;
    description = `Browse ${category} events with server-rendered EventMap results.${pageDescriptionNote}`;
    intro = buildIntro({
      baseIntro: `Browse server-rendered ${category} events from the EventMap controlled source.`,
      currentPage,
      requestedPage,
      totalCount,
      totalPages,
    });
  } else if (city) {
    h1 = `Events in ${city}`;
    description = `Browse events in ${city} with server-rendered EventMap results.${pageDescriptionNote}`;
    intro = buildIntro({
      baseIntro: `Browse server-rendered events in ${city}.`,
      currentPage,
      requestedPage,
      totalCount,
      totalPages,
    });
  } else if (query) {
    h1 = `Search results for "${query}"`;
    description = `Server-rendered controlled event results for "${query}".${pageDescriptionNote}`;
    intro = buildIntro({
      baseIntro: `Browse controlled EventMap events that match "${query}".`,
      currentPage,
      requestedPage,
      totalCount,
      totalPages,
    });
  } else {
    intro = buildIntro({
      baseIntro: intro,
      currentPage,
      requestedPage,
      totalCount,
      totalPages,
    });
  }

  return {
    title: `${h1}${pageTitleNote}`,
    description,
    h1,
    intro,
    resultLabel,
    canonicalPreview,
    cleanUrlPreview,
    indexPolicy: buildIndexPolicy({ filters, totalCount, totalPages }),
  };
}

