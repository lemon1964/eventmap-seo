// src/app/[locale]/demo/lab-1/page.tsx
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getDemoEvents } from "@/server/api/demoEvents";
import {
  getLocaleFromParams,
  type LocaleParams,
} from "@/shared/lib/localeParams";
import { routes } from "@/shared/lib/routes";

type SearchParamsDemoPageProps = {
  params: LocaleParams;
  searchParams: Promise<{
    city?: string;
  }>;
};

const cityFilters = [
  { label: "all", value: "" },
  { label: "London", value: "london" },
  { label: "Berlin", value: "berlin" },
  { label: "New York", value: "new-york" },
];

export default async function SearchParamsDemoPage({
  params,
  searchParams,
}: SearchParamsDemoPageProps) {
  const locale = await getLocaleFromParams(params);
  const t = await getTranslations({ locale, namespace: "demo" });
  const query = await searchParams;
  const activeCity = query.city ?? "";
  const result = await getDemoEvents({ locale, city: activeCity });

  return (
    <section className="container demo-page">
      <div className="demo-hero">
        <p className="hero__eyebrow">{t("lab1Eyebrow")}</p>
        <h1>{t("lab1Title")}</h1>
        <p>{t("lab1Description")}</p>
        <Link className="button button--secondary" href={routes.demo(locale)}>
          {t("backToDemo")}
        </Link>
      </div>

      <div className="app-grid locale-panel" aria-label="Search params details">
        <div className="app-surface locale-panel__item">
          <span>{t("urlSegment")}</span>
          <strong className="app-code-text locale-panel__value">/{locale}</strong>
        </div>
        <div className="app-surface locale-panel__item">
          <span>{t("paramsLocale")}</span>
          <strong className="app-code-text locale-panel__value">{locale}</strong>
        </div>
        <div className="app-surface locale-panel__item">
          <span>{t("dataLocale")}</span>
          <strong className="app-code-text locale-panel__value">{result.locale}</strong>
        </div>
      </div>

      <div className="app-cluster demo-toolbar" aria-label={t("lab1FilterAria")}>
        {cityFilters.map((filter) => {
          const isActive = filter.value === activeCity;
          const href = filter.value
            ? `${routes.demoLab1(locale)}?city=${filter.value}`
            : routes.demoLab1(locale);

          return (
            <Link
              className={isActive ? "app-chip app-chip--active demo-chip" : "app-chip demo-chip"}
              href={href}
              key={filter.label}
            >
              {filter.label === "all" ? t("all") : filter.label}
            </Link>
          );
        })}
      </div>

      <div className="app-grid demo-grid">
        {result.events.map((event) => (
          <article className="app-surface app-stack app-muted-copy demo-event-card" key={event.id}>
            <div className="demo-event-card__meta">
              <span>{event.city}</span>
              <span>{event.dateLabel}</span>
            </div>
            <h2>{event.title}</h2>
            <p>{event.description}</p>
            <span className="app-badge demo-event-card__category">{event.category}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
