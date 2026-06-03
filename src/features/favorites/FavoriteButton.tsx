// src/features/favorites/FavoriteButton.tsx
"use client";

import type { MouseEvent } from "react";
import type { EventCardData } from "@/entities/event/types";
import { useFavoritesCloud } from "@/features/favorites/useFavoritesCloud";

type FavoriteButtonProps = {
  event?: EventCardData;
  eventId: string;
};

export function FavoriteButton({ event, eventId }: FavoriteButtonProps) {
  const { isFavorite, isHydrated, removeFavorite, toggleFavoriteEvent } =
    useFavoritesCloud();
  const isFavoriteEvent = isHydrated && isFavorite(eventId);
  const label = isFavoriteEvent ? "Remove from favorites" : "Save to favorites";

  function handleClick(clickEvent: MouseEvent<HTMLButtonElement>) {
    clickEvent.preventDefault();
    clickEvent.stopPropagation();

    if (!isHydrated) {
      return;
    }

    if (event) {
      void toggleFavoriteEvent(event);
      return;
    }

    if (isFavoriteEvent) {
      void removeFavorite(eventId);
    }
  }

  return (
    <button
      aria-label={label}
      aria-pressed={isFavoriteEvent}
      className={isFavoriteEvent ? "fav-btn fav-btn--active" : "fav-btn"}
      onClick={handleClick}
      title={label}
      type="button"
    >
      {isFavoriteEvent ? "❤️" : "🤍"}
    </button>
  );
}
