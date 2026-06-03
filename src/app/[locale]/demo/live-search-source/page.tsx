// src/app/[locale]/demo/live-search-source/page.tsx
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  getLocaleFromParams,
  type LocaleParams,
} from "@/shared/lib/localeParams";
import { routes } from "@/shared/lib/routes";

type DemoLiveSearchSourcePageProps = {
  params: LocaleParams;
};

const stepKeys = [
  "url",
  "category",
  "provider",
  "normalise",
  "fallback",
  "pagination",
  "html",
] as const;

const examplePaths = [
  "/search/music",
  "/search/sports",
  "/search/arts",
  "/search/film",
  "/search?q=jazz",
  "/search/music?q=jazz",
];

export default async function DemoLiveSearchSourcePage({
  params,
}: DemoLiveSearchSourcePageProps) {
  const locale = await getLocaleFromParams(params);
  const t = await getTranslations({ locale, namespace: "demo" });

  return (
    <section className="container demo-page">
      <div className="demo-hero">
        <p className="hero__eyebrow">{t("eyebrow")}</p>
        <h1>{t("liveSearchSourceTitle")}</h1>
        <p>{t("liveSearchSourceDescription")}</p>
      </div>

      <div className="app-grid live-search-source-grid">
        <article className="app-surface app-stack app-muted-copy">
          <h2>{t("liveSearchSourceSeoTitle")}</h2>
          <p>{t("liveSearchSourceSeoDescription")}</p>
        </article>
        <article className="app-surface app-stack app-muted-copy">
          <h2>{t("liveSearchSourceFallbackTitle")}</h2>
          <p>{t("liveSearchSourceFallbackDescription")}</p>
        </article>
      </div>

      <ol className="source-boundary-steps">
        {stepKeys.map((step) => (
          <li key={step}>{t(`liveSearchSourceSteps.${step}`)}</li>
        ))}
      </ol>

      <div className="app-surface app-stack search-segments-note">
        <h2>{t("liveSearchSourceExamplesTitle")}</h2>
        <div className="app-cluster search-navigation-examples">
          {examplePaths.map((path) => (
            <code key={path}>/{locale}{path}</code>
          ))}
        </div>
      </div>

      <Link className="button search-reset" href={routes.demo(locale)}>
        {t("backToDemo")}
      </Link>
    </section>
  );
}
