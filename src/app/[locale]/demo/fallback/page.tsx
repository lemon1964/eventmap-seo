// src/app/[locale]/demo/fallback/page.tsx
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getFallbackDemoResult } from "@/server/api/fallbackDemo";
import {
  getLocaleFromParams,
  type LocaleParams,
} from "@/shared/lib/localeParams";
import { routes } from "@/shared/lib/routes";
import { EmptyState } from "@/shared/ui/EmptyState";
import { EventCard } from "@/shared/ui/EventCard";

type FallbackDemoPageProps = {
  params: LocaleParams;
  searchParams: Promise<{
    mode?: string;
  }>;
};

const demoModes = ["ok", "empty", "invalid", "rate-limit"];

export default async function FallbackDemoPage({
  params,
  searchParams,
}: FallbackDemoPageProps) {
  const locale = await getLocaleFromParams(params);
  const t = await getTranslations({ locale, namespace: "demo" });
  const query = await searchParams;
  const result = getFallbackDemoResult(query.mode ?? "ok");

  return (
    <section className="container demo-page">
      <div className="demo-hero">
        <p className="hero__eyebrow">{t("fallbackPageEyebrow")}</p>
        <h1>{t("fallbackPageTitle")}</h1>
        <p>{t("fallbackPageDescription")}</p>
        <Link className="button button--secondary" href={routes.demo(locale)}>
          {t("backToDemo")}
        </Link>
      </div>

      <div className="app-cluster demo-toolbar" aria-label="Fallback mode">
        {demoModes.map((mode) => (
          <Link
            className={
              result.mode === mode ? "app-chip app-chip--active demo-chip" : "app-chip demo-chip"
            }
            href={`${routes.demoFallback(locale)}?mode=${mode}`}
            key={mode}
          >
            {t(`fallbackMode.${mode}`)}
          </Link>
        ))}
      </div>

      <div className={`app-surface app-stack app-muted-copy fallback-demo fallback-demo--${result.status}`}>
        <span>{t(`fallbackStatus.${result.status}`)}</span>
        <p>{t(`fallbackMessage.${result.mode}`)}</p>
      </div>

      {result.events.length > 0 ? (
        <div className="events-grid">
          {result.events.map((event) => (
            <EventCard event={event} key={event.id} locale={locale} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={t("fallbackEmptyTitle")}
          description={t("fallbackEmptyDescription")}
        />
      )}
    </section>
  );
}
