// src/features/favorites/useFavorites.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import type { EventCardData } from "@/entities/event/types";
import {
  FAVORITE_EVENTS_STORAGE_KEY,
  FAVORITES_STORAGE_KEY,
  normaliseFavoriteIds,
  parseFavoriteEvents,
  parseFavoriteIds,
  stringifyFavoriteEvents,
  stringifyFavoriteIds,
} from "@/features/favorites/favoritesStorage";

type UseFavoritesResult = {
  favoriteIds: string[];
  isFavorite: (id: string) => boolean;
  isHydrated: boolean;
  removeFavorite: (id: string) => void;
  toggleFavorite: (id: string) => void;
  toggleFavoriteEvent: (event: EventCardData) => void;
};

type FavoriteEventsMap = Record<string, EventCardData>;

let favoriteIdsStore: string[] = [];
let favoriteEventsStore: FavoriteEventsMap = {};
let isStoreHydrated = false;
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function readStoreFromBrowser() {
  favoriteIdsStore = parseFavoriteIds(
    window.localStorage.getItem(FAVORITES_STORAGE_KEY),
  );
  favoriteEventsStore = parseFavoriteEvents(
    window.localStorage.getItem(FAVORITE_EVENTS_STORAGE_KEY),
  );
  isStoreHydrated = true;
  notifyListeners();
}

function writeStoreToBrowser(
  nextFavoriteIds: string[],
  nextFavoriteEvents = favoriteEventsStore,
) {
  favoriteIdsStore = normaliseFavoriteIds(nextFavoriteIds);
  favoriteEventsStore = nextFavoriteEvents;
  window.localStorage.setItem(
    FAVORITES_STORAGE_KEY,
    stringifyFavoriteIds(favoriteIdsStore),
  );
  window.localStorage.setItem(
    FAVORITE_EVENTS_STORAGE_KEY,
    stringifyFavoriteEvents(favoriteEventsStore),
  );
  notifyListeners();
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function useFavorites(): UseFavoritesResult {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(favoriteIdsStore);
  const [isHydrated, setIsHydrated] = useState(isStoreHydrated);

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setFavoriteIds(favoriteIdsStore);
      setIsHydrated(isStoreHydrated);
    });

    if (!isStoreHydrated) {
      const timer = window.setTimeout(readStoreFromBrowser, 0);

      return () => {
        window.clearTimeout(timer);
        unsubscribe();
      };
    }

    return unsubscribe;
  }, []);

  const isFavorite = useCallback(
    (id: string) => favoriteIds.includes(id),
    [favoriteIds],
  );

  const removeFavorite = useCallback((id: string) => {
    if (!isStoreHydrated) {
      return;
    }

    const nextFavoriteEvents = { ...favoriteEventsStore };
    delete nextFavoriteEvents[id];

    writeStoreToBrowser(
      favoriteIdsStore.filter((currentId) => currentId !== id),
      nextFavoriteEvents,
    );
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    if (!isStoreHydrated) {
      return;
    }

    if (favoriteIdsStore.includes(id)) {
      const nextFavoriteEvents = { ...favoriteEventsStore };
      delete nextFavoriteEvents[id];

      writeStoreToBrowser(
        favoriteIdsStore.filter((currentId) => currentId !== id),
        nextFavoriteEvents,
      );
      return;
    }

    writeStoreToBrowser([...favoriteIdsStore, id]);
  }, []);

  const toggleFavoriteEvent = useCallback((event: EventCardData) => {
    if (!isStoreHydrated) {
      return;
    }

    if (favoriteIdsStore.includes(event.id)) {
      const nextFavoriteEvents = { ...favoriteEventsStore };
      delete nextFavoriteEvents[event.id];

      writeStoreToBrowser(
        favoriteIdsStore.filter((currentId) => currentId !== event.id),
        nextFavoriteEvents,
      );
      return;
    }

    writeStoreToBrowser([...favoriteIdsStore, event.id], {
      ...favoriteEventsStore,
      [event.id]: event,
    });
  }, []);

  return {
    favoriteIds,
    isFavorite,
    isHydrated,
    removeFavorite,
    toggleFavorite,
    toggleFavoriteEvent,
  };
}

export function getFavoriteEvents(): EventCardData[] {
  if (typeof window === "undefined") {
    return [];
  }

  const favoriteIds = parseFavoriteIds(
    window.localStorage.getItem(FAVORITES_STORAGE_KEY),
  );
  const favoriteEvents = parseFavoriteEvents(
    window.localStorage.getItem(FAVORITE_EVENTS_STORAGE_KEY),
  );

  return favoriteIds.flatMap((id) => {
    const event = favoriteEvents[id];

    return event ? [event] : [];
  });
}

export function upsertFavoriteEvents(events: EventCardData[]) {
  if (typeof window === "undefined" || events.length === 0) {
    return;
  }

  favoriteEventsStore = {
    ...parseFavoriteEvents(
      window.localStorage.getItem(FAVORITE_EVENTS_STORAGE_KEY),
    ),
  };

  for (const event of events) {
    favoriteEventsStore[event.id] = event;
  }

  window.localStorage.setItem(
    FAVORITE_EVENTS_STORAGE_KEY,
    stringifyFavoriteEvents(favoriteEventsStore),
  );
  notifyListeners();
}
