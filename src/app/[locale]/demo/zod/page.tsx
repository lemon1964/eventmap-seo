// src/app/[locale]/demo/zod/page.tsx
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getRawEventCheckResults } from "@/server/api/events";
import {
  getLocaleFromParams,
  type LocaleParams,
} from "@/shared/lib/localeParams";
import { routes } from "@/shared/lib/routes";

type ZodDemoPageProps = {
  params: LocaleParams;
};

export default async function ZodDemoPage({ params }: ZodDemoPageProps) {
  const locale = await getLocaleFromParams(params);
  const t = await getTranslations({ locale, namespace: "demo" });
  const rawEventCheckResults = await getRawEventCheckResults({ locale });

  return (
    <section className="container demo-page">
      <div className="demo-hero">
        <p className="hero__eyebrow">{t("eyebrow")}</p>
        <h1>{t("zodTitle")}</h1>
        <p>{t("zodDescription")}</p>
        <Link className="button button--secondary" href={routes.demo(locale)}>
          {t("backToDemo")}
        </Link>
      </div>

      <section className="app-stack zod-report" aria-labelledby="zod-report-title">
        <div className="section-header">
          <p className="hero__eyebrow">{t("zodTitle")}</p>
          <h2 id="zod-report-title">{t("zodDescription")}</h2>
        </div>

        <div className="app-stack zod-report__list">
          {rawEventCheckResults.map((item) => (
            <article
              className={`app-surface app-stack zod-report__item zod-report__item--${item.status}`}
              key={item.index}
            >
              <div>
                <span className="app-badge zod-report__status">
                  {item.status === "accepted"
                    ? t("zodAccepted")
                    : t("zodRejected")}
                </span>
                <h3>{item.label}</h3>
              </div>
              <p className="zod-report__reason">{item.reason}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
