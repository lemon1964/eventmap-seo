// src/app/[locale]/demo/controlled-source/page.tsx
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getControlledEventIds } from "@/server/api/controlledEvents";
import {
  getLocaleFromParams,
  type LocaleParams,
} from "@/shared/lib/localeParams";
import { routes } from "@/shared/lib/routes";

type ControlledSourceDemoPageProps = {
  params: LocaleParams;
};

const sampleLiveId = "G5viZu8MnrP4H";

export default async function ControlledSourceDemoPage({
  params,
}: ControlledSourceDemoPageProps) {
  const locale = await getLocaleFromParams(params);
  const t = await getTranslations({ locale, namespace: "demo" });
  const controlledIds = getControlledEventIds();
  const firstControlledId = controlledIds[0];

  return (
    <section className="container demo-page">
      <div className="demo-hero">
        <p className="hero__eyebrow">{t("controlledSourceEyebrow")}</p>
        <h1>{t("controlledSourceTitle")}</h1>
        <p>{t("controlledSourceDescription")}</p>
        <Link className="button button--secondary" href={routes.demo(locale)}>
          {t("backToDemo")}
        </Link>
      </div>

      <div className="app-stack controlled-source">
        <div className="app-grid controlled-source__grid">
          <article className="app-surface app-stack app-muted-copy controlled-source__card">
            <span className="app-badge controlled-source__label">
              {t("controlledSourceControlledLabel")}
            </span>
            <div className="app-stack controlled-source__list">
              {controlledIds.slice(0, 3).map((id) => (
                <code className="app-code-text controlled-source__value" key={id}>
                  {id}
                </code>
              ))}
            </div>
            <p>{t("controlledSourceControlledDescription")}</p>
          </article>

          <article className="app-surface app-stack app-muted-copy controlled-source__card">
            <span className="app-badge controlled-source__label">
              {t("controlledSourceLiveLabel")}
            </span>
            <code className="app-code-text controlled-source__value">{sampleLiveId}</code>
            <p>{t("controlledSourceLiveDescription")}</p>
          </article>
        </div>

        <div className="app-cluster controlled-source__actions">
          <Link
            className="button"
            href={routes.eventDetail(locale, firstControlledId)}
          >
            {t("controlledSourceOpenControlled")}
          </Link>
          <Link
            className="button button--secondary"
            href={routes.eventDetail(locale, sampleLiveId)}
          >
            {t("controlledSourceOpenLive")}
          </Link>
        </div>
      </div>
    </section>
  );
}
