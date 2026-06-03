// src/features/events/EventDetails.tsx
import type { ReactNode } from "react";
import Link from "next/link";
import type { EventCardData } from "@/entities/event/types";
import {
  buildSearchHref,
  searchCategories,
} from "@/entities/search/searchFilters";
import type { Locale } from "@/shared/lib/locales";

type EventDetailsLabels = {
  category?: string;
  date: string;
  getTickets?: string;
  location: string;
  moreEvents?: string;
  price?: string;
  venue: string;
};

type EventDetailsProps = {
  actions?: ReactNode;
  event: EventCardData;
  labels?: EventDetailsLabels;
  locale: Locale;
  mode: "modal" | "page";
};

const defaultLabels: EventDetailsLabels = {
  category: "Category",
  date: "Date",
  getTickets: "Get Tickets",
  location: "Location",
  moreEvents: "More events",
  price: "Price",
  venue: "Venue",
};

function truncateDescription(description: string): string {
  if (description.length <= 180) {
    return description;
  }

  return `${description.slice(0, 180).trimEnd()}...`;
}

function formatDateLabel(dateLabel: string, locale: Locale): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateLabel)) {
    return dateLabel;
  }

  const date = new Date(`${dateLabel}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateLabel;
  }

  return new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function getCategorySlug(category: string): string {
  const match = searchCategories.find(
    (item) => item.ticketmasterLabel.toLowerCase() === category.toLowerCase(),
  );

  return match?.slug ?? category.toLowerCase();
}

export function EventDetails({
  actions,
  event,
  labels = defaultLabels,
  locale,
  mode,
}: EventDetailsProps) {
  if (mode === "page") {
    const date = event.timeLabel
      ? `${formatDateLabel(event.dateLabel, locale)} · ${event.timeLabel}`
      : formatDateLabel(event.dateLabel, locale);
    const category = event.genreLabel
      ? `${event.category} · ${event.genreLabel}`
      : event.category;
    const moreEventsHref = buildSearchHref({
      filters: { category: getCategorySlug(event.category) },
      locale,
    });

    return (
      <div className="detail-page">
        {actions}

        {event.imageUrl ? (
          <div className="detail-hero">
            {/* В уроке не подключаем next/image и remote image config. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" src={event.imageUrl} />
          </div>
        ) : null}

        <h1 className="detail-title">{event.title}</h1>
        <p className="detail-description">{event.description}</p>

        <div className="detail-meta">
          <div className="detail-meta-item">
            <span aria-hidden="true">📅</span>
            <div>
              <div>{labels.date}</div>
              <strong>{date}</strong>
            </div>
          </div>
          <div className="detail-meta-item">
            <span aria-hidden="true">📍</span>
            <div>
              <div>{labels.venue}</div>
              <strong>
                {event.venue}, {event.city}
              </strong>
            </div>
          </div>
          <div className="detail-meta-item">
            <span aria-hidden="true">🎪</span>
            <div>
              <div>{labels.category}</div>
              <strong>{category}</strong>
            </div>
          </div>
          <div className="detail-meta-item">
            <span aria-hidden="true">💰</span>
            <div>
              <div>{labels.price}</div>
              <strong>{event.priceLabel ?? "Free"}</strong>
            </div>
          </div>
        </div>

        <div className="detail-actions">
          <a
            className="btn-primary"
            href={event.ticketUrl ?? moreEventsHref}
            rel={event.ticketUrl ? "noopener noreferrer" : undefined}
            target={event.ticketUrl ? "_blank" : undefined}
          >
            {labels.getTickets} →
          </a>
          <Link className="btn-secondary" href={moreEventsHref}>
            {labels.moreEvents}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {event.imageUrl ? (
        // В уроке 6.2 не подключаем next/image и remote image config.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt=""
          className="event-modal-preview__image"
          loading="lazy"
          src={event.imageUrl}
        />
      ) : (
        <div className="event-modal-preview__image event-modal-preview__image--placeholder">
          {event.category}
        </div>
      )}

      <div className="modal-panel__body app-stack app-muted-copy">
        <h2>{event.title}</h2>
        <dl className="app-detail-list event-modal-preview__meta">
          <div>
            <dt>{labels.date}</dt>
            <dd>{event.dateLabel}</dd>
          </div>
          <div>
            <dt>{labels.venue}</dt>
            <dd>{event.venue}</dd>
          </div>
          <div>
            <dt>{labels.location}</dt>
            <dd>
              {event.city}, {event.country}
            </dd>
          </div>
        </dl>
        <p>{truncateDescription(event.description)}</p>
        {actions ? (
          <div className="app-cluster event-modal-preview__actions">{actions}</div>
        ) : null}
      </div>
    </>
  );
}
