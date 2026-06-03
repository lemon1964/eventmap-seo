// src/app/[locale]/demo/search-navigation/page.tsx
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  getLocaleFromParams,
  type LocaleParams,
} from "@/shared/lib/localeParams";
import { routes } from "@/shared/lib/routes";

type SearchNavigationPageProps = {
  params: LocaleParams;
};

export default async function SearchNavigationPage({
  params,
}: SearchNavigationPageProps) {
  const locale = await getLocaleFromParams(params);
  const t = await getTranslations({ locale, namespace: "demo" });
  const examples = [
    `/${locale}/search`,
    `/${locale}/search/music`,
    `/${locale}/search/music/london`,
    `/${locale}/search/music/london?page=2`,
    `/${locale}/search/music/london?q=jazz&page=2`,
  ];

  return (
    <section className="container demo-page">
      <div className="demo-hero">
        <p className="hero__eyebrow">{t("eyebrow")}</p>
        <h1>{t("searchNavigationTitle")}</h1>
        <p>{t("searchNavigationDescription")}</p>
      </div>

      <div className="app-grid search-navigation-grid">
        <article className="app-surface app-stack app-muted-copy">
          <h2>{t("searchNavigationCleanUrlTitle")}</h2>
          <p>{t("searchNavigationCleanUrlDescription")}</p>
        </article>
        <article className="app-surface app-stack app-muted-copy">
          <h2>{t("searchNavigationActiveTitle")}</h2>
          <p>{t("searchNavigationActiveDescription")}</p>
        </article>
        <article className="app-surface app-stack app-muted-copy">
          <h2>{t("searchNavigationResetTitle")}</h2>
          <p>{t("searchNavigationResetDescription")}</p>
        </article>
        <article className="app-surface app-stack app-muted-copy">
          <h2>{t("searchNavigationPaginationTitle")}</h2>
          <p>{t("searchNavigationPaginationDescription")}</p>
        </article>
      </div>

      <div className="app-cluster search-navigation-examples">
        {examples.map((example) => (
          <code key={example}>{example}</code>
        ))}
      </div>

      <div className="app-surface app-muted-copy search-navigation-note">
        <h2>{t("searchNavigationLinkTitle")}</h2>
        <p>{t("searchNavigationLinkDescription")}</p>
      </div>

      <Link className="button button--secondary" href={routes.demo(locale)}>
        {t("backToDemo")}
      </Link>
    </section>
  );
}
