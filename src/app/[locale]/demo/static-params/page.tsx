// src/app/[locale]/demo/static-params/page.tsx
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getStaticEventParams } from "@/server/api/staticEventParams";
import {
  getLocaleFromParams,
  type LocaleParams,
} from "@/shared/lib/localeParams";
import { routes } from "@/shared/lib/routes";

type StaticParamsDemoPageProps = {
  params: LocaleParams;
};

export default async function StaticParamsDemoPage({
  params,
}: StaticParamsDemoPageProps) {
  const locale = await getLocaleFromParams(params);
  const t = await getTranslations({ locale, namespace: "demo" });
  const staticParams = getStaticEventParams();

  return (
    <section className="container demo-page">
      <div className="demo-hero">
        <p className="hero__eyebrow">{t("staticParamsEyebrow")}</p>
        <h1>{t("staticParamsTitle")}</h1>
        <p>{t("staticParamsDescription")}</p>
        <Link className="button button--secondary" href={routes.demo(locale)}>
          {t("backToDemo")}
        </Link>
      </div>

      <div className="app-grid route-map-notes" aria-label="Static params notes">
        <p>{t("staticParamsLocaleNote")}</p>
        <p>{t("staticParamsIdNote")}</p>
        <p>{t("staticParamsBuildNote")}</p>
      </div>

      <div className="app-grid static-params-grid">
        {staticParams.map((item) => (
          <article
            className="app-surface app-stack route-map-card"
            key={`${item.locale}-${item.id}`}
          >
            <div className="route-map-card__header">
              <span className="app-badge route-map-card__badge">{item.locale}</span>
              <strong className="app-code-text route-map-card__pattern">
                /{item.locale}/events/{item.id}
              </strong>
            </div>
            <dl className="app-detail-list route-map-card__details">
              <div>
                <dt>{t("paramsLocale")}</dt>
                <dd>{item.locale}</dd>
              </div>
              <div>
                <dt>{t("staticParamsEventId")}</dt>
                <dd className="app-code-text route-map-card__example">{item.id}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
