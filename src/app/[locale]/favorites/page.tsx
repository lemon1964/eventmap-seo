// src/app/[locale]/favorites/page.tsx
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildFavoritesSeoPaths } from "@/entities/seo/seoPaths";
import { toNextMetadata } from "@/entities/seo/toNextMetadata";
import { FavoritesPageClient } from "@/features/favorites/FavoritesPageClient";
import {
  getLocaleFromParams,
  type LocaleParams,
} from "@/shared/lib/localeParams";

type PageProps = {
  params: LocaleParams;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const locale = await getLocaleFromParams(params);
  const seoPaths = buildFavoritesSeoPaths(locale);

  return toNextMetadata({
    title: locale === "ru" ? "Избранное" : "Favorites",
    description:
      locale === "ru"
        ? "Сохранённые события EventMap из браузера или аккаунта."
        : "Saved EventMap events from this browser or account.",
    ...seoPaths,
  });
}

export default async function FavoritesPage({ params }: PageProps) {
  const locale = await getLocaleFromParams(params);

  const t = await getTranslations({ locale, namespace: "favorites" });

  return (
    <section className="container demo-page search-page--product">
      <div className="search-product-hero">
        <h1>{t("title")}</h1>
      </div>

      <FavoritesPageClient locale={locale} />
    </section>
  );
}
