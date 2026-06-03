// src/app/[locale]/@modal/(.)events/[id]/page.tsx
import Link from "next/link";
import { EventDetails } from "@/features/events/EventDetails";
import { fetchEventById } from "@/server/api/events";
import { getLocaleFromParams } from "@/shared/lib/localeParams";
import { getSafeReturnTo } from "@/shared/lib/returnTo";
import { routes } from "@/shared/lib/routes";

type EventPreviewModalPageProps = {
  params: Promise<{
    id: string;
    locale: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function EventPreviewModalPage({
  params,
  searchParams,
}: EventPreviewModalPageProps) {
  const locale = await getLocaleFromParams(params);
  const { id } = await params;
  const query = await searchParams;
  const returnTo = getSafeReturnTo({
    fallback: routes.search(locale),
    locale,
    searchParams: query,
  });
  const event = await fetchEventById({ id, locale });

  if (!event) {
    return (
      <div className="modal-backdrop">
        <aside
          className="modal-panel event-modal-preview"
          aria-label="Event preview"
        >
          <div className="modal-panel__header">
            <span className="app-badge">Preview</span>
            <Link
              className="button button--secondary"
              href={returnTo}
              scroll={false}
            >
              Close
            </Link>
          </div>
          <div className="modal-panel__body app-stack app-muted-copy">
            <h2>Event preview unavailable</h2>
            <p>
              This event could not be loaded. The full EventMap page is still
              intact.
            </p>
          </div>
        </aside>
      </div>
    );
  }

  return (
    <div className="modal-backdrop">
      <aside
        className="modal-panel event-modal-preview"
        aria-label="Event preview"
      >
        <div className="modal-panel__header">
          <span className="app-badge">{event.category}</span>
          <Link
            className="button button--secondary"
            href={returnTo}
            scroll={false}
          >
            Close
          </Link>
        </div>

        <EventDetails
          actions={
            <>
              <a className="button" href={routes.eventDetail(locale, event.id)}>
                Open full page
              </a>
              <Link
                className="button button--secondary"
                href={returnTo}
                scroll={false}
              >
                Close
              </Link>
            </>
          }
          event={event}
          locale={locale}
          mode="modal"
        />
      </aside>
    </div>
  );
}
