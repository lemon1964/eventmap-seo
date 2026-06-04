// src/app/[locale]/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { buildSearchHref, searchCategories } from "@/entities/search/searchFilters";
import { toNextMetadata } from "@/entities/seo/toNextMetadata";
import { HomeEventsSection } from "@/features/events/HomeEventsSection";
import { getLocaleFromParams, type LocaleParams } from "@/shared/lib/localeParams";
import { buildHomeSeoPaths } from "@/entities/seo/seoPaths";
import { SkeletonBlock } from "@/shared/ui/SkeletonBlock";
import { TrackedLink } from "@/shared/ui/TrackedLink";

type PageProps = {
  params: LocaleParams;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = await getLocaleFromParams(params);
  const seoPaths = buildHomeSeoPaths(locale);

  return toNextMetadata({
    title: locale === "ru" ? "Живые события рядом" : "Discover Live Events",
    description:
      locale === "ru"
        ? "Ищите концерты, спорт, театр, кино и живые события рядом."
        : "Find concerts, sports, theatre, film and live events near you.",
    ...seoPaths,
  });
}

export default async function Home({ params }: PageProps) {
  const locale = await getLocaleFromParams(params);
  const t = await getTranslations({ locale, namespace: "home" });
  const heroTitle =
    locale === "ru"
      ? { accent: "Живые", rest: "события рядом" }
      : { accent: "Discover", rest: "Live Events" };

  return (
    <>
      <section className="hero">
        <div className="hero__inner">
          <h1 className="hero__title">
            <span>{heroTitle.accent}</span> {heroTitle.rest}
          </h1>
          <p className="hero__text">{t("hero.description")}</p>

          <form action={`/${locale}/search`} className="home-search-form" method="get">
            <input
              aria-label={t("searchPlaceholder")}
              name="q"
              placeholder={t("searchPlaceholder")}
              type="search"
            />
            <button type="submit">{t("searchButton")}</button>
          </form>
        </div>
      </section>

      <section className="container demo-page home-category-flow">
        <div className="section-header">
          <p className="home-section-title">{t("browseByCategory")}</p>
        </div>

        <div className="app-cluster home-category-grid">
          {searchCategories.map(category => {
            const href = buildSearchHref({
              filters: { category: category.slug },
              locale,
            });

            const content = (
              <>
                <span aria-hidden="true">{category.icon}</span>
                <strong>{category.label[locale]}</strong>
              </>
            );

            if (category.slug === "music") {
              return (
                <TrackedLink
                  className="app-chip home-category-card"
                  event="Music"
                  href={href}
                  key={category.slug}
                  src="EventMap Course"
                >
                  {content}
                </TrackedLink>
              );
            }

            return (
              <Link className="app-chip home-category-card" href={href} key={category.slug}>
                {content}
              </Link>
            );
          })}
        </div>
        {/* <div className="app-cluster home-category-grid">
          {searchCategories.map((category) => (
            <Link
              className="app-chip home-category-card"
              href={buildSearchHref({
                filters: { category: category.slug },
                locale,
              })}
              key={category.slug}
            >
              <span aria-hidden="true">{category.icon}</span>
              <strong>{category.label[locale]}</strong>
            </Link>
          ))}
        </div> */}
      </section>

      <Suspense
        fallback={
          <section className="container demo-page home-events-section">
            <SkeletonBlock
              description="Featured events are streaming into the page."
              label="featured"
              title="Loading featured events"
            />
          </section>
        }
      >
        <HomeEventsSection locale={locale} />
      </Suspense>
    </>
  );
}
