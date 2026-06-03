// src/features/search/ClientSearchDemo.tsx
"use client";

import { useEffect, useState } from "react";
import { controlledEventCards } from "@/entities/event/controlledEvents";
import type { EventCardData } from "@/entities/event/types";
import type { Locale } from "@/shared/lib/locales";
import { EventCard } from "@/shared/ui/EventCard";

type ClientSearchDemoProps = {
  locale: Locale;
  initialLabel: string;
  loadedLabel: string;
};

export function ClientSearchDemo({
  initialLabel,
  loadedLabel,
  locale,
}: ClientSearchDemoProps) {
  const [events, setEvents] = useState<EventCardData[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setEvents(controlledEventCards);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="app-stack client-search-demo">
      <div className="app-surface client-search-demo__state">
        <strong>{events.length > 0 ? loadedLabel : initialLabel}</strong>
        <span>{events.length} events</span>
      </div>

      {events.length > 0 ? (
        <div className="events-grid">
          {events.map((event) => (
            <EventCard
              event={event}
              key={event.id}
              locale={locale}
              variant="static"
            />
          ))}
        </div>
      ) : (
        <div className="app-surface app-muted-copy client-search-demo__empty">{initialLabel}</div>
      )}
    </div>
  );
}
