// src/app/[locale]/search/[[...segments]]/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import {
  buildSearchHref,
  hasSearchFilters,
  parseSearchInput,
  searchCategories,
} from "@/entities/search/searchFilters";
import { buildSearchMeta } from "@/entities/search/searchMeta";
import { toNextMetadata } from "@/entities/seo/toNextMetadata";
import { SearchResultsSection } from "@/features/search/SearchResultsSection";
import { getLocaleFromParams } from "@/shared/lib/localeParams";
import { buildSearchSeoPaths } from "@/entities/seo/seoPaths";
import { SkeletonBlock } from "@/shared/ui/SkeletonBlock";

type PageProps = {
  params: Promise<{
    locale: string;
    segments?: string[];
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const locale = await getLocaleFromParams(params);
  const { segments } = await params;
  const filters = parseSearchInput({
    searchParams: await searchParams,
    segments,
  });
  const meta = buildSearchMeta({
    currentPage: Math.max(filters.page, 1),
    filters,
    locale,
    totalCount: 1,
    totalPages: 1,
  });
  const seoPaths = buildSearchSeoPaths({ filters, locale });

  return toNextMetadata({
    title: meta.title,
    description: meta.description,
    noIndex: !meta.indexPolicy.shouldIndex,
    ...seoPaths,
  });
}

export default async function SearchPage({ params, searchParams }: PageProps) {
  const locale = await getLocaleFromParams(params);
  const { segments } = await params;
  const filters = parseSearchInput({
    searchParams: await searchParams,
    segments,
  });
  const meta = buildSearchMeta({
    currentPage: Math.max(filters.page, 1),
    filters,
    locale,
    totalCount: 1,
    totalPages: 1,
  });

  const t = await getTranslations({ locale, namespace: "search" });

  return (
    <section className="container demo-page search-page--product">
      <div className="search-product-hero">
        <h1>{meta.h1}</h1>
      </div>

      <nav className="app-cluster search-category-bar" aria-label={t("categoryLabel")}>
        <Link
          aria-current={!filters.category ? "page" : undefined}
          className={
            !filters.category
              ? "app-chip app-chip--active search-category-chip"
              : "app-chip search-category-chip"
          }
          href={buildSearchHref({ filters: {}, locale })}
        >
          {t("filters.all")}
        </Link>

        {searchCategories.map(category => {
          const isActive = filters.category === category.slug;

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              className={
                isActive
                  ? "app-chip app-chip--active search-category-chip"
                  : "app-chip search-category-chip"
              }
              href={buildSearchHref({
                filters: { category: category.slug },
                locale,
              })}
              key={category.slug}
            >
              <span aria-hidden="true">{category.icon}</span>
              {t(`filters.${category.slug}`)}
            </Link>
          );
        })}
      </nav>

      {hasSearchFilters(filters) ? (
        <Link className="button search-reset" href={buildSearchHref({ filters: {}, locale })}>
          {t("reset")}
        </Link>
      ) : null}

      <Suspense
        key={buildSearchHref({ filters, locale })}
        fallback={
          <SkeletonBlock
            description="Search results are streaming into the page."
            label="results"
            title="Loading events"
          />
        }
      >
        <SearchResultsSection filters={filters} locale={locale} />
      </Suspense>
    </section>
  );
}
