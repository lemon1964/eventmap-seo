// src/shared/ui/EventCard.tsx
import Link from "next/link";
import type { EventCardData } from "@/entities/event/types";
import { FavoriteButton } from "@/features/favorites/FavoriteButton";
import type { Locale } from "@/shared/lib/locales";
import { routes } from "@/shared/lib/routes";

type EventCardProps = {
  event: EventCardData;
  locale: Locale;
  descriptionMode?: "short" | "full";
  navigationMode?: "client" | "direct";
  returnTo?: string;
  variant?: "link" | "static";
};

function truncateDescription(description: string): string {
  if (description.length <= 100) {
    return description;
  }

  return `${description.slice(0, 100).trimEnd()}...`;
}

export function EventCard({
  descriptionMode = "short",
  event,
  locale,
  navigationMode = "client",
  returnTo,
  variant = "link",
}: EventCardProps) {
  const description =
    descriptionMode === "full"
      ? event.description
      : truncateDescription(event.description);

  const cardContent = (
    <>
      {event.imageUrl ? (
        // В уроке 2.4 не подключаем next/image и remote image config.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt=""
          className="event-card__image"
          loading="lazy"
          src={event.imageUrl}
        />
      ) : (
        <div
          className="event-card__image event-card__image--placeholder"
          aria-hidden="true"
        >
          <span>{event.category}</span>
        </div>
      )}

      <div className="event-card__body">
        <div className="event-card__meta">
          <span>{event.dateLabel}</span>
          <span>{event.city}</span>
        </div>
        <h3 className="event-card__title">{event.title}</h3>
        <p className="event-card__location">
          {event.venue}, {event.country}
        </p>
        <p className="event-card__description">{description}</p>
        <div className="event-card__footer">
          <span>{event.category}</span>
          {event.priceLabel ? <strong>{event.priceLabel}</strong> : null}
        </div>
      </div>
    </>
  );

  const card = (
    <article className="event-card">
      <FavoriteButton event={event} eventId={event.id} />
      {cardContent}
    </article>
  );

  if (variant === "static") {
    return card;
  }

  const detailHref = routes.eventDetail(locale, event.id);
  const href = returnTo
    ? `${detailHref}?${new URLSearchParams({ returnTo }).toString()}`
    : detailHref;

  if (navigationMode === "direct") {
    return (
      <article className="event-card">
        <FavoriteButton event={event} eventId={event.id} />
        <a className="event-card-link" href={detailHref}>
          {cardContent}
        </a>
      </article>
    );
  }

  return (
    <article className="event-card">
      <FavoriteButton event={event} eventId={event.id} />
      <Link className="event-card-link" href={href} scroll={false}>
        {cardContent}
      </Link>
    </article>
  );
}
