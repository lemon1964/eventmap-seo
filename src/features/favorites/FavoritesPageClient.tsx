// src/features/favorites/FavoritesPageClient.tsx
"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useFavoritesCloud } from "@/features/favorites/useFavoritesCloud";
import type { Locale } from "@/shared/lib/locales";
import { routes } from "@/shared/lib/routes";
import { EmptyState } from "@/shared/ui/EmptyState";
import { EventCard } from "@/shared/ui/EventCard";

type FavoritesPageClientProps = {
  locale: Locale;
};

const copy = {
  en: {
    accountMode: "Account favorites",
    browserMode: "Browser favorites",
    emptyDescription: "Save events from search or home, then come back here.",
    emptyTitle: "No favorite events yet",
    loading: "Loading favorite events...",
    openSearch: "Open search",
  },
  ru: {
    accountMode: "Избранное аккаунта",
    browserMode: "Избранное браузера",
    emptyDescription:
      "Сохраняйте события на главной или в поиске, а затем возвращайтесь сюда.",
    emptyTitle: "В избранном пока нет событий",
    loading: "Загружаем избранные события...",
    openSearch: "Открыть поиск",
  },
} as const;

export function FavoritesPageClient({ locale }: FavoritesPageClientProps) {
  const { favoriteEvents, favoriteIds, isHydrated, isLoading, mode } =
    useFavoritesCloud();
  const t = copy[locale];

  const visibleEvents = useMemo(() => {
    const eventsById = new Map(
      favoriteEvents.map((event) => [event.id, event]),
    );

    return favoriteIds.flatMap((id) => {
      const event = eventsById.get(id);

      return event ? [event] : [];
    });
  }, [favoriteEvents, favoriteIds]);

  if (!isHydrated || isLoading) {
    return (
      <div className="app-surface app-muted-copy">
        <p>{t.loading}</p>
      </div>
    );
  }

  if (favoriteIds.length === 0 || visibleEvents.length === 0) {
    return (
      <div className="app-stack">
        <p className="app-badge">
          {mode === "user" ? t.accountMode : t.browserMode}
        </p>
        <EmptyState title={t.emptyTitle} description={t.emptyDescription} />
        <Link className="button button--secondary" href={routes.search(locale)}>
          {t.openSearch}
        </Link>
      </div>
    );
  }

  return (
    <div className="app-stack">
      <p className="app-badge">
        {mode === "user" ? t.accountMode : t.browserMode}
      </p>
      <div className="events-grid">
        {visibleEvents.map((event) => (
          <EventCard
            event={event}
            key={event.id}
            locale={locale}
            navigationMode="direct"
          />
        ))}
      </div>
    </div>
  );
}
