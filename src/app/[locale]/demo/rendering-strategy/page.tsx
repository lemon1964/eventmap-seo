// src/app/[locale]/demo/rendering-strategy/page.tsx
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { renderingStrategyItems } from "@/entities/renderingStrategy/strategies";
import {
  getLocaleFromParams,
  type LocaleParams,
} from "@/shared/lib/localeParams";
import { routes } from "@/shared/lib/routes";
import { RenderingStrategyCard } from "@/shared/ui/RenderingStrategyCard";

type RenderingStrategyPageProps = {
  params: LocaleParams;
};

export default async function RenderingStrategyPage({
  params,
}: RenderingStrategyPageProps) {
  const locale = await getLocaleFromParams(params);
  const t = await getTranslations({ locale, namespace: "demo" });

  const labels = {
    route: t("renderingStrategyRoute"),
    role: t("renderingStrategyRole"),
    dataSource: t("renderingStrategyDataSource"),
    strategy: t("renderingStrategyMode"),
    cachePolicy: t("renderingStrategyCachePolicy"),
    reason: t("renderingStrategyReason"),
  };

  return (
    <section className="container demo-page">
      <div className="demo-hero">
        <p className="hero__eyebrow">{t("eyebrow")}</p>
        <h1>{t("renderingStrategyTitle")}</h1>
        <p>{t("renderingStrategyDescription")}</p>
      </div>

      <div className="app-grid rendering-strategy-grid">
        {renderingStrategyItems.map((item) => (
          <RenderingStrategyCard item={item} key={item.id} labels={labels} />
        ))}
      </div>

      <Link className="button button--secondary" href={routes.demo(locale)}>
        {t("backToDemo")}
      </Link>
    </section>
  );
}
