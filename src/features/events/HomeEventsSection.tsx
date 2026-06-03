// src/features/events/HomeEventsSection.tsx
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getHomeEvents } from "@/server/api/events";
import type { Locale } from "@/shared/lib/locales";
import { routes } from "@/shared/lib/routes";
import { EmptyState } from "@/shared/ui/EmptyState";
import { EventCard } from "@/shared/ui/EventCard";

type HomeEventsSectionProps = {
  locale: Locale;
};

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function HomeEventsSection({ locale }: HomeEventsSectionProps) {
  await wait(1000);

  const t = await getTranslations({ locale, namespace: "home" });
  const homeEvents = await getHomeEvents({ locale });

  return (
    <section className="container demo-page home-events-section">
      <div className="section-header">
        <p className="hero__eyebrow">{t("featured.title")}</p>
        <Link className="section-see-all" href={routes.search(locale)}>
          {t("featured.seeAll")}
        </Link>
      </div>

      {homeEvents.events.length > 0 ? (
        <div className="events-grid">
          {homeEvents.events.map((event) => (
            <EventCard
              event={event}
              key={event.id}
              locale={locale}
              returnTo={routes.home(locale)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          description={t("events.emptyDescription")}
          title={t("events.emptyTitle")}
        />
      )}
    </section>
  );
}
