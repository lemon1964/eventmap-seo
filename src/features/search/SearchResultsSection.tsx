// src/features/search/SearchResultsSection.tsx
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  buildSearchHref,
  type SearchFilters,
} from "@/entities/search/searchFilters";
import { getSearchPageEvents } from "@/server/api/searchEvents";
import type { Locale } from "@/shared/lib/locales";
import { EmptyState } from "@/shared/ui/EmptyState";
import { EventCard } from "@/shared/ui/EventCard";

type SearchResultsSectionProps = {
  filters: SearchFilters;
  locale: Locale;
};

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function SearchResultsSection({
  filters,
  locale,
}: SearchResultsSectionProps) {
  await wait(1000);

  const t = await getTranslations({ locale, namespace: "search" });
  const searchResult = await getSearchPageEvents({ filters, locale });
  const previousPage = Math.max(1, searchResult.currentPage - 1);
  const nextPage = Math.min(searchResult.totalPages, searchResult.currentPage + 1);
  const returnTo = buildSearchHref({ filters, locale });

  return (
    <>
      <p className="search-count">
        {t("eventsFound", { count: searchResult.totalCount })}
      </p>

      {searchResult.events.length > 0 ? (
        <div className="events-grid">
          {searchResult.events.map((event) => (
            <EventCard
              event={event}
              key={event.id}
              locale={locale}
              returnTo={returnTo}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          description={t("emptyDescription")}
          title={t("emptyTitle")}
        />
      )}

      {searchResult.totalPages > 1 ? (
        <nav
          className="app-cluster search-compact-pagination"
          aria-label={t("paginationLabel")}
        >
          <Link
            aria-disabled={!searchResult.hasPreviousPage}
            className={
              searchResult.hasPreviousPage
                ? "app-chip search-page-link"
                : "app-chip search-page-link search-page-link--disabled"
            }
            href={buildSearchHref({
              filters: { ...filters, page: previousPage },
              locale,
            })}
          >
            ← {t("previous")}
          </Link>

          <span className="search-page-indicator">
            {searchResult.currentPage} / {searchResult.totalPages}
          </span>

          <Link
            aria-disabled={!searchResult.hasNextPage}
            className={
              searchResult.hasNextPage
                ? "app-chip search-page-link"
                : "app-chip search-page-link search-page-link--disabled"
            }
            href={buildSearchHref({
              filters: { ...filters, page: nextPage },
              locale,
            })}
          >
            {t("next")} →
          </Link>
        </nav>
      ) : null}
    </>
  );
}
