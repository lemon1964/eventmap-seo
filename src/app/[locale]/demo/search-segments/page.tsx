// src/app/[locale]/demo/search-segments/page.tsx
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  getLocaleFromParams,
  type LocaleParams,
} from "@/shared/lib/localeParams";
import { routes } from "@/shared/lib/routes";

type SearchSegmentsPageProps = {
  params: LocaleParams;
};

export default async function SearchSegmentsPage({
  params,
}: SearchSegmentsPageProps) {
  const locale = await getLocaleFromParams(params);
  const t = await getTranslations({ locale, namespace: "demo" });
  const examples = [
    {
      url: `/${locale}/search`,
      segments: t("searchSegmentsNone"),
      query: t("searchSegmentsNone"),
      result: t("searchSegmentsAll"),
    },
    {
      url: `/${locale}/search/music`,
      segments: "music",
      query: t("searchSegmentsNone"),
      result: "category=music",
    },
    {
      url: `/${locale}/search/london`,
      segments: "london",
      query: t("searchSegmentsNone"),
      result: "city=london",
    },
    {
      url: `/${locale}/search/music/london`,
      segments: "music / london",
      query: t("searchSegmentsNone"),
      result: "category=music, city=london",
    },
    {
      url: `/${locale}/search/music/london?q=jazz`,
      segments: "music / london",
      query: "q=jazz",
      result: "category=music, city=london, q=jazz",
    },
  ];

  return (
    <section className="container demo-page">
      <div className="demo-hero">
        <p className="hero__eyebrow">{t("eyebrow")}</p>
        <h1>{t("searchSegmentsTitle")}</h1>
        <p>{t("searchSegmentsDescription")}</p>
      </div>

      <div className="app-surface app-muted-copy search-segments-note">
        <h2>{t("searchSegmentsCatchAllTitle")}</h2>
        <p>{t("searchSegmentsCatchAllDescription")}</p>
      </div>

      <div className="app-grid search-segments-grid">
        {examples.map((example) => (
          <article className="app-surface app-stack search-segments-card" key={example.url}>
            <strong>{example.url}</strong>
            <dl className="app-detail-list">
              <div>
                <dt>{t("searchSegmentsPath")}</dt>
                <dd>{example.segments}</dd>
              </div>
              <div>
                <dt>{t("searchSegmentsQuery")}</dt>
                <dd>{example.query}</dd>
              </div>
              <div>
                <dt>{t("searchSegmentsResult")}</dt>
                <dd>{example.result}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <Link className="button button--secondary" href={routes.demo(locale)}>
        {t("backToDemo")}
      </Link>
    </section>
  );
}
