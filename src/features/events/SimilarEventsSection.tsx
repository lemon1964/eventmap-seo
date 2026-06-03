// src/features/events/SimilarEventsSection.tsx
import type { EventCardData } from "@/entities/event/types";
import {
  buildSearchHref,
  searchCategories,
} from "@/entities/search/searchFilters";
import { getSimilarEvents } from "@/server/api/events";
import type { Locale } from "@/shared/lib/locales";
import { EventCard } from "@/shared/ui/EventCard";

type SimilarEventsSectionProps = {
  currentEvent: EventCardData;
  locale: Locale;
};

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getCategorySlug(category: string): string {
  const match = searchCategories.find(
    (item) => item.ticketmasterLabel.toLowerCase() === category.toLowerCase(),
  );

  return match?.slug ?? category.toLowerCase();
}

export async function SimilarEventsSection({
  currentEvent,
  locale,
}: SimilarEventsSectionProps) {
  await wait(1400);

  const similarEvents = await getSimilarEvents({ currentEvent, locale });

  if (similarEvents.length === 0) {
    return null;
  }

  const returnTo = buildSearchHref({
    filters: { category: getCategorySlug(currentEvent.category) },
    locale,
  });
  const title = locale === "ru" ? "Похожие события" : "Similar events";

  return (
    <section className="detail-similar">
      <h2 className="section-title">{title}</h2>
      <div className="events-grid">
        {similarEvents.map((event) => (
          <EventCard
            event={event}
            key={event.id}
            locale={locale}
            returnTo={returnTo}
          />
        ))}
      </div>
    </section>
  );
}
