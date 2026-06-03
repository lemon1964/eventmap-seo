// src/app/[locale]/demo/client-search/page.tsx
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ClientSearchDemo } from "@/features/search/ClientSearchDemo";
import {
  getLocaleFromParams,
  type LocaleParams,
} from "@/shared/lib/localeParams";
import { routes } from "@/shared/lib/routes";

type ClientSearchPageProps = {
  params: LocaleParams;
};

export default async function ClientSearchPage({
  params,
}: ClientSearchPageProps) {
  const locale = await getLocaleFromParams(params);
  const t = await getTranslations({ locale, namespace: "demo" });

  return (
    <section className="container demo-page">
      <div className="demo-hero">
        <p className="hero__eyebrow">{t("eyebrow")}</p>
        <h1>{t("clientSearchTitle")}</h1>
        <p>{t("clientSearchDescription")}</p>
      </div>

      <div className="app-surface app-muted-copy search-lesson-note">
        <h2>{t("clientSearchWeakTitle")}</h2>
        <p>{t("clientSearchWeakDescription")}</p>
      </div>

      <ClientSearchDemo
        initialLabel={t("clientSearchInitialState")}
        loadedLabel={t("clientSearchLoadedState")}
        locale={locale}
      />

      <Link className="button button--secondary" href={routes.demo(locale)}>
        {t("backToDemo")}
      </Link>
    </section>
  );
}
