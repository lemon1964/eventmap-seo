// src/entities/seo/sitemapEntries.ts
import type { MetadataRoute } from "next";
import { searchCategories } from "@/entities/search/searchFilters";
import { getStaticEventParams } from "@/server/api/staticEventParams";
import { locales } from "@/shared/lib/locales";
import { routes } from "@/shared/lib/routes";
import { toAbsoluteUrl } from "@/entities/seo/siteConfig";

type SitemapEntry = MetadataRoute.Sitemap[number];

function createSitemapEntry({
  changeFrequency,
  path,
  priority,
}: {
  changeFrequency: SitemapEntry["changeFrequency"];
  path: string;
  priority: SitemapEntry["priority"];
}): SitemapEntry {
  return {
    url: toAbsoluteUrl(path) ?? path,
    lastModified: new Date(),
    changeFrequency,
    priority,
  };
}

export function buildStaticSitemapEntries(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) => [
    createSitemapEntry({
      path: routes.home(locale),
      changeFrequency: "daily",
      priority: 1,
    }),
  ]);
}

export function buildSearchSitemapEntries(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) => [
    createSitemapEntry({
      path: routes.search(locale),
      changeFrequency: "daily",
      priority: 0.9,
    }),
    ...searchCategories.map((category) =>
      createSitemapEntry({
        path: `${routes.search(locale)}/${category.slug}`,
        changeFrequency: "daily",
        priority: 0.8,
      }),
    ),
  ]);
}

export function buildEventSitemapEntries(): MetadataRoute.Sitemap {
  return getStaticEventParams().map(({ id, locale }) =>
    createSitemapEntry({
      path: routes.eventDetail(locale, id),
      changeFrequency: "weekly",
      priority: 0.7,
    }),
  );
}

export function buildSitemapEntries(): MetadataRoute.Sitemap {
  return [
    ...buildStaticSitemapEntries(),
    ...buildSearchSitemapEntries(),
    ...buildEventSitemapEntries(),
  ];
}
