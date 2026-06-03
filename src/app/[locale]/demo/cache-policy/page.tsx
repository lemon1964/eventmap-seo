// src/app/[locale]/demo/cache-policy/page.tsx
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getControlledEventIds } from "@/server/api/controlledEvents";
import {
  getPreviewCacheMode,
  getPreviewEvents,
} from "@/server/api/previewEvents";
import { cachePolicy } from "@/server/cache/cachePolicy";
import {
  getLocaleFromParams,
  type LocaleParams,
} from "@/shared/lib/localeParams";
import { routes } from "@/shared/lib/routes";

type CachePolicyPageProps = {
  params: LocaleParams;
};

type CachePolicyBlock = {
  title: string;
  description: string;
  rows: {
    label: string;
    value: string;
  }[];
  tokens: string[];
};

export default async function CachePolicyPage({
  params,
}: CachePolicyPageProps) {
  const locale = await getLocaleFromParams(params);
  const t = await getTranslations({ locale, namespace: "demo" });
  const previewEvents = await getPreviewEvents({ locale });
  const controlledEventIds = getControlledEventIds();

  const blocks: CachePolicyBlock[] = [
    {
      title: t("cacheControlledTitle"),
      description: t("cacheControlledDescription"),
      rows: [
        { label: t("cacheRevalidate"), value: "none" },
        { label: t("cacheTags"), value: "none" },
      ],
      tokens: controlledEventIds,
    },
    {
      title: t("cacheLiveTitle"),
      description: t("cacheLiveDescription"),
      rows: [
        {
          label: t("cacheRevalidate"),
          value: `${cachePolicy.liveEventsRevalidate}s`,
        },
        {
          label: t("cacheRevalidate"),
          value: `${cachePolicy.liveEventDetailRevalidate}s`,
        },
        { label: t("cacheTags"), value: cachePolicy.tags.liveEvents },
        { label: t("cacheTags"), value: cachePolicy.tags.liveEventDetail },
      ],
      tokens: [
        cachePolicy.tags.liveEvents,
        cachePolicy.tags.liveEventDetail,
        `${cachePolicy.tags.liveEventDetail}:event-id`,
      ],
    },
    {
      title: t("cachePreviewTitle"),
      description: t("cachePreviewDescription"),
      rows: [{ label: t("cacheNoStore"), value: getPreviewCacheMode() }],
      tokens: previewEvents.map((event) => event.id),
    },
  ];

  return (
    <section className="container demo-page">
      <div className="demo-hero">
        <p className="hero__eyebrow">{t("eyebrow")}</p>
        <h1>{t("cachePolicyTitle")}</h1>
        <p>{t("cachePolicyDescription")}</p>
      </div>

      <div className="app-grid cache-policy-grid">
        {blocks.map((block) => (
          <article className="app-surface app-stack app-muted-copy cache-policy-card" key={block.title}>
            <div>
              <h2>{block.title}</h2>
              <p>{block.description}</p>
            </div>

            <dl className="app-detail-list cache-policy-card__meta">
              {block.rows.map((row) => (
                <div key={`${block.title}-${row.label}-${row.value}`}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>

            <div className="cache-policy-card__tokens">
              {block.tokens.map((token) => (
                <span className="app-badge cache-policy-token" key={token}>
                  {token}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <Link className="button button--secondary" href={routes.demo(locale)}>
        {t("backToDemo")}
      </Link>
    </section>
  );
}
