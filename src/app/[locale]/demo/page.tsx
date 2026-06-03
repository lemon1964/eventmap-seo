// src/app/[locale]/demo/page.tsx
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getLocaleFromParams, type LocaleParams } from "@/shared/lib/localeParams";
import { routes } from "@/shared/lib/routes";

type DemoPageProps = {
  params: LocaleParams;
};

export default async function DemoPage({ params }: DemoPageProps) {
  const locale = await getLocaleFromParams(params);

  const t = await getTranslations({ locale, namespace: "demo" });
  const courseCards = [
    {
      title: t("courseCards.seo.title"),
      text: t("courseCards.seo.text"),
    },
    {
      title: t("courseCards.i18n.title"),
      text: t("courseCards.i18n.text"),
    },
    {
      title: t("courseCards.patterns.title"),
      text: t("courseCards.patterns.text"),
    },
  ];
  const demoCards = [
    {
      title: t("lab1CardTitle"),
      description: t("lab1CardDescription"),
      href: routes.demoLab1(locale),
    },
    {
      title: t("zodCardTitle"),
      description: t("zodCardDescription"),
      href: routes.demoZod(locale),
    },
    {
      title: t("fallbackCardTitle"),
      description: t("fallbackCardDescription"),
      href: routes.demoFallback(locale),
    },
    {
      title: t("routesCardTitle"),
      description: t("routesCardDescription"),
      href: routes.demoRoutes(locale),
    },
    {
      title: t("staticParamsCardTitle"),
      description: t("staticParamsCardDescription"),
      href: routes.demoStaticParams(locale),
    },
    {
      title: t("controlledSourceCardTitle"),
      description: t("controlledSourceCardDescription"),
      href: routes.demoControlledSource(locale),
    },
    {
      title: t("cachePolicyCardTitle"),
      description: t("cachePolicyCardDescription"),
      href: routes.demoCachePolicy(locale),
    },
    {
      title: t("renderingStrategyCardTitle"),
      description: t("renderingStrategyCardDescription"),
      href: routes.demoRenderingStrategy(locale),
    },
    {
      title: t("liveCacheCardTitle"),
      description: t("liveCacheCardDescription"),
      href: routes.demoLiveCache(locale),
    },
    {
      title: t("clientSearchCardTitle"),
      description: t("clientSearchCardDescription"),
      href: routes.demoClientSearch(locale),
    },
    {
      title: t("searchSegmentsCardTitle"),
      description: t("searchSegmentsCardDescription"),
      href: routes.demoSearchSegments(locale),
    },
    {
      title: t("searchNavigationCardTitle"),
      description: t("searchNavigationCardDescription"),
      href: routes.demoSearchNavigation(locale),
    },
    {
      title: t("liveSearchSourceCardTitle"),
      description: t("liveSearchSourceCardDescription"),
      href: routes.demoLiveSearchSource(locale),
    },
    {
      title: t("seoBaselineCardTitle"),
      description: t("seoBaselineCardDescription"),
      href: routes.demoSeoBaseline(locale),
    },
    {
      title: t("parallelRoutesCardTitle"),
      description: t("parallelRoutesCardDescription"),
      href: routes.demoParallelRoutes(locale),
    },
    {
      title: t("modalVsFullPageCardTitle"),
      description: t("modalVsFullPageCardDescription"),
      href: routes.demoModalVsFullPage(locale),
    },
    {
      title: t("suspenseStreamingCardTitle"),
      description: t("suspenseStreamingCardDescription"),
      href: routes.demoSuspenseStreaming(locale),
    },
    {
      title: t("supabaseArchitectureCardTitle"),
      description: t("supabaseArchitectureCardDescription"),
      href: routes.demoSupabaseArchitecture(locale),
    },
    {
      title: t("supabaseRlsCardTitle"),
      description: t("supabaseRlsCardDescription"),
      href: routes.demoSupabaseRls(locale),
    },
    {
      title: t("supabaseAuthCardTitle"),
      description: t("supabaseAuthCardDescription"),
      href: routes.demoSupabaseAuth(locale),
    },
    {
      title: t("supabaseCloudFavoritesCardTitle"),
      description: t("supabaseCloudFavoritesCardDescription"),
      href: routes.demoSupabaseCloudFavorites(locale),
    },
    {
      title: t("finalArchitectureCardTitle"),
      description: t("finalArchitectureCardDescription"),
      href: routes.demoFinalArchitecture(locale),
    },
  ];

  return (
    <section className="container demo-page">
      <div className="demo-hero">
        <p className="hero__eyebrow">{t("courseEyebrow")}</p>
        <h1>{t("courseTitle")}</h1>
        <p>{t("courseDescription")}</p>
      </div>

      <div className="app-grid demo-course-grid">
        {courseCards.map(card => (
          <article className="app-surface app-stack app-muted-copy info-card" key={card.title}>
            <h2>{card.title}</h2>
            <p>{card.text}</p>
          </article>
        ))}
      </div>

      <div className="demo-hero demo-hero--compact">
        <p className="hero__eyebrow">{t("eyebrow")}</p>
        <h2>{t("indexTitle")}</h2>
        <p>{t("indexDescription")}</p>
      </div>

      <div className="app-grid locale-panel" aria-label="Locale details">
        <div className="app-surface locale-panel__item">
          <span>{t("urlSegment")}</span>
          <strong className="app-code-text locale-panel__value">/{locale}</strong>
        </div>
        <div className="app-surface locale-panel__item">
          <span>{t("htmlLang")}</span>
          <strong className="app-code-text locale-panel__value">{locale}</strong>
        </div>
        <div className="app-surface locale-panel__item">
          <span>{t("paramsLocale")}</span>
          <strong className="app-code-text locale-panel__value">{locale}</strong>
        </div>
      </div>

      <div className="app-grid demo-index-grid">
        {demoCards.map(card => (
          <Link
            className="app-surface app-stack app-muted-copy demo-index-card"
            href={card.href}
            key={card.href}
          >
            <h2>{card.title}</h2>
            <p>{card.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
