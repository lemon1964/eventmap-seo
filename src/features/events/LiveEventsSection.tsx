// src/features/events/LiveEventsSection.tsx
import { getTranslations } from "next-intl/server";
import { getLiveHomeEvents } from "@/server/api/events";
import type { Locale } from "@/shared/lib/locales";
import { EmptyState } from "@/shared/ui/EmptyState";
import { EventCard } from "@/shared/ui/EventCard";

type LiveEventsSectionProps = {
  locale: Locale;
};

export async function LiveEventsSection({ locale }: LiveEventsSectionProps) {
  const t = await getTranslations({ locale, namespace: "home" });
  const liveEvents = await getLiveHomeEvents({ locale });

  return (
    <section className="container demo-page live-events-section">
      <div className="section-header live-events-header">
        <p className="hero__eyebrow">{t("live.eyebrow")}</p>
        <h2>{t("live.title")}</h2>
        <p className="live-events-note">{t("live.description")}</p>
        <p className="data-source">
          {t("live.sourceLabel")}: {" "}
          <strong>
            {liveEvents.source === "ticketmaster"
              ? t("live.sourceTicketmaster")
              : t("live.sourceFallback")}
          </strong>
        </p>
      </div>

      {liveEvents.events.length > 0 ? (
        <div className="events-grid">
          {liveEvents.events.map((event) => (
            <EventCard
              event={event}
              key={event.id}
              locale={locale}
              variant="static"
            />
          ))}
        </div>
      ) : (
        <EmptyState
          description={t("live.emptyDescription")}
          title={t("live.emptyTitle")}
        />
      )}
    </section>
  );
}
