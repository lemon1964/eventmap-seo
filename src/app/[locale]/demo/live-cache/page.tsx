// src/app/[locale]/demo/live-cache/page.tsx
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { cachePolicy } from "@/server/cache/cachePolicy";
import { getFeaturedEvents, getLiveHomeEvents } from "@/server/api/events";
import {
  getLocaleFromParams,
  type LocaleParams,
} from "@/shared/lib/localeParams";
import { routes } from "@/shared/lib/routes";
import { EventCard } from "@/shared/ui/EventCard";

type LiveCachePageProps = {
  params: LocaleParams;
};

export default async function LiveCachePage({ params }: LiveCachePageProps) {
  const locale = await getLocaleFromParams(params);
  const t = await getTranslations({ locale, namespace: "demo" });
  const homeT = await getTranslations({ locale, namespace: "home" });
  const controlledEvents = await getFeaturedEvents({ locale });
  const liveEvents = await getLiveHomeEvents({ locale });

  return (
    <section className="container demo-page">
      <div className="demo-hero">
        <p className="hero__eyebrow">{t("eyebrow")}</p>
        <h1>{t("liveCacheTitle")}</h1>
        <p>{t("liveCacheDescription")}</p>
      </div>

      <div className="app-grid live-cache-grid">
        <article className="app-surface app-stack app-muted-copy live-cache-card">
          <div>
            <h2>{t("liveCacheControlledTitle")}</h2>
            <p>{t("liveCacheControlledDescription")}</p>
          </div>

          <dl className="app-detail-list live-cache-meta">
            <div>
              <dt>{homeT("featured.sourceLabel")}</dt>
              <dd>{homeT("featured.sourceControlled")}</dd>
            </div>
            <div>
              <dt>{t("routesPattern")}</dt>
              <dd>/[locale]/events/[id]</dd>
            </div>
          </dl>

          <div className="events-grid">
            {controlledEvents.events.slice(0, 2).map((event) => (
              <EventCard event={event} key={event.id} locale={locale} />
            ))}
          </div>
        </article>

        <article className="app-surface app-stack app-muted-copy live-cache-card">
          <div>
            <h2>{t("liveCacheLiveTitle")}</h2>
            <p>{t("liveCacheLiveDescription")}</p>
          </div>

          <dl className="app-detail-list live-cache-meta">
            <div>
              <dt>{t("liveCacheSource")}</dt>
              <dd>
                {liveEvents.source === "ticketmaster"
                  ? homeT("live.sourceTicketmaster")
                  : homeT("live.sourceFallback")}
              </dd>
            </div>
            <div>
              <dt>{t("cacheRevalidate")}</dt>
              <dd>{cachePolicy.liveEventsRevalidate}s</dd>
            </div>
            <div>
              <dt>{t("cacheTags")}</dt>
              <dd>{cachePolicy.tags.liveEvents}</dd>
            </div>
          </dl>

          <div className="events-grid">
            {liveEvents.events.slice(0, 3).map((event) => (
              <EventCard
                event={event}
                key={event.id}
                locale={locale}
                variant="static"
              />
            ))}
          </div>
        </article>
      </div>

      <Link className="button button--secondary" href={routes.demo(locale)}>
        {t("backToDemo")}
      </Link>
    </section>
  );
}
