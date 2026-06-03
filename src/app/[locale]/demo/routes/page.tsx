// src/app/[locale]/demo/routes/page.tsx
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { routeMapItems } from "@/entities/routeMap/routes";
import {
  getLocaleFromParams,
  type LocaleParams,
} from "@/shared/lib/localeParams";
import { routes } from "@/shared/lib/routes";
import { RouteMapCard } from "@/shared/ui/RouteMapCard";

type RouteMapPageProps = {
  params: LocaleParams;
};

export default async function RouteMapPage({ params }: RouteMapPageProps) {
  const locale = await getLocaleFromParams(params);
  const t = await getTranslations({ locale, namespace: "demo" });

  const labels = {
    pattern: t("routesPattern"),
    example: t("routesExample"),
    segments: t("routesSegments"),
    layer: t("routesLayer"),
  };

  return (
    <section className="container demo-page">
      <div className="demo-hero">
        <p className="hero__eyebrow">{t("eyebrow")}</p>
        <h1>{t("routesTitle")}</h1>
        <p>{t("routesDescription")}</p>
        <Link className="button button--secondary" href={routes.demo(locale)}>
          {t("backToDemo")}
        </Link>
      </div>

      <div className="app-grid route-map-notes" aria-label="Dynamic route notes">
        <p>{t("routesLocaleNote")}</p>
        <p>{t("routesIdNote")}</p>
        <p>{t("routesQueryNote")}</p>
      </div>

      <div className="app-stack route-map">
        {routeMapItems.map((item) => (
          <RouteMapCard item={item} key={item.id} labels={labels} />
        ))}
      </div>
    </section>
  );
}
