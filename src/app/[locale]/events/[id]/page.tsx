// src/app/[locale]/events/[id]/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getEventNotFoundMetadata } from "@/entities/seo/pageMetadata";
import { toNextMetadata } from "@/entities/seo/toNextMetadata";
import { buildEventSeoPaths } from "@/entities/seo/seoPaths";
import { EventDetails } from "@/features/events/EventDetails";
import { SimilarEventsSection } from "@/features/events/SimilarEventsSection";
import { fetchEventById } from "@/server/api/events";
import { getStaticEventParams } from "@/server/api/staticEventParams";
import { getLocaleFromParams } from "@/shared/lib/localeParams";
import { routes } from "@/shared/lib/routes";
import { SkeletonBlock } from "@/shared/ui/SkeletonBlock";

type EventDetailParams = Promise<{
  locale: string;
  id: string;
}>;

type EventDetailPageProps = {
  params: EventDetailParams;
};

// Controlled ids строятся заранее, live Ticketmaster ids открываются по запросу.
export const dynamicParams = true;

export function generateStaticParams() {
  return getStaticEventParams();
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const locale = await getLocaleFromParams(params);
  const { id } = await params;
  const event = await fetchEventById({ id, locale });
  const seoPaths = buildEventSeoPaths({ id, locale });

  if (!event) {
    return getEventNotFoundMetadata(locale);
  }

  return toNextMetadata({
    title: event.title,
    description: `${event.description} ${event.venue}, ${event.city}.`,
    imageUrl: event.imageUrl,
    ...seoPaths,
  });
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const locale = await getLocaleFromParams(params);
  const { id } = await params;
  const t = await getTranslations({ locale, namespace: "eventDetail" });
  const event = await fetchEventById({ id, locale });

  if (!event) {
    notFound();
  }

  return (
    <section className="container demo-page">
      <EventDetails
        actions={
          <Link className="button button--secondary" href={routes.home(locale)}>
            {t("backHome")}
          </Link>
        }
        event={event}
        labels={{
          category: t("category"),
          date: t("date"),
          getTickets: t("getTickets"),
          location: t("location"),
          moreEvents: t("moreEvents"),
          price: t("price"),
          venue: t("venue"),
        }}
        locale={locale}
        mode="page"
      />

      <Suspense
        fallback={
          <SkeletonBlock
            description="Similar events are streaming into the detail page."
            label="similar"
            title="Loading similar events"
          />
        }
      >
        <SimilarEventsSection currentEvent={event} locale={locale} />
      </Suspense>
    </section>
  );
}
