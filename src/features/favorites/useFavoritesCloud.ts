// src/features/favorites/useFavoritesCloud.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/client/api/supabase/client";
import type { EventCardData } from "@/entities/event/types";
import type {
  CloudFavoriteInsert,
  CloudFavoriteMode,
  CloudFavoriteRow,
  CloudFavoriteState,
} from "@/features/favorites/cloudFavoriteTypes";
import {
  getFavoriteEvents,
  useFavorites,
} from "@/features/favorites/useFavorites";

type SupabaseBrowserClient = NonNullable<
  ReturnType<typeof createSupabaseBrowserClient>
>;

type CloudStore = CloudFavoriteState & {
  userId: string | null;
};

type UseFavoritesCloudResult = {
  favoriteEvents: EventCardData[];
  favoriteIds: string[];
  isFavorite: (id: string) => boolean;
  isHydrated: boolean;
  isLoading: boolean;
  mode: CloudFavoriteMode;
  removeFavorite: (id: string) => Promise<void> | void;
  toggleFavoriteEvent: (event: EventCardData) => Promise<void> | void;
};

const MIGRATION_FLAG_PREFIX = "eventmap:favorites:migrated:";

let cloudStore: CloudStore = {
  events: [],
  favoriteIds: [],
  isHydrated: false,
  isLoading: false,
  mode: "guest",
  userId: null,
};
let isAuthCheckRunning = false;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function setCloudStore(nextStore: CloudStore) {
  cloudStore = nextStore;
  notifyListeners();
}

function patchCloudStore(patch: Partial<CloudStore>) {
  setCloudStore({
    ...cloudStore,
    ...patch,
  });
}

function normaliseEvents(events: EventCardData[]): EventCardData[] {
  const eventsById = new Map<string, EventCardData>();

  for (const event of events) {
    eventsById.set(event.id, event);
  }

  return Array.from(eventsById.values());
}

function getFavoriteIds(events: EventCardData[]): string[] {
  return events.map((event) => event.id);
}

function isEventCardData(value: unknown): value is EventCardData {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const event = value as Partial<EventCardData>;

  return (
    typeof event.id === "string" &&
    typeof event.title === "string" &&
    typeof event.city === "string" &&
    typeof event.country === "string" &&
    typeof event.category === "string" &&
    typeof event.dateLabel === "string" &&
    typeof event.venue === "string" &&
    typeof event.description === "string" &&
    typeof event.imageUrl === "string"
  );
}

function rowsToEvents(rows: CloudFavoriteRow[]): EventCardData[] {
  return rows.flatMap((row) => {
    const snapshot: unknown = row.event_snapshot;

    return isEventCardData(snapshot) ? [snapshot] : [];
  });
}

function getMigrationFlagKey(userId: string): string {
  return `${MIGRATION_FLAG_PREFIX}${userId}`;
}

function hasMigrationFlag(userId: string): boolean {
  try {
    return window.localStorage.getItem(getMigrationFlagKey(userId)) === "1";
  } catch {
    return false;
  }
}

function setMigrationFlag(userId: string) {
  try {
    window.localStorage.setItem(getMigrationFlagKey(userId), "1");
  } catch {
    // localStorage can be unavailable in restricted browser modes.
  }
}

function mergeCloudEvents(nextEvents: EventCardData[]) {
  const events = normaliseEvents([...nextEvents, ...cloudStore.events]);

  patchCloudStore({
    events,
    favoriteIds: getFavoriteIds(events),
  });
}

async function migrateLocalFavoritesToCloud({
  existingIds,
  supabase,
  userId,
}: {
  existingIds: Set<string>;
  supabase: SupabaseBrowserClient;
  userId: string;
}) {
  if (hasMigrationFlag(userId)) {
    return;
  }

  const localEvents = getFavoriteEvents().filter(
    (event) => !existingIds.has(event.id),
  );

  if (localEvents.length === 0) {
    setMigrationFlag(userId);
    return;
  }

  const rows: CloudFavoriteInsert[] = localEvents.map((event) => ({
    event_id: event.id,
    event_snapshot: event,
    user_id: userId,
  }));

  const { error } = await supabase.from("favorites").insert(rows);

  if (error) {
    return;
  }

  mergeCloudEvents(localEvents);
  setMigrationFlag(userId);
}

async function loadCloudFavorites({
  supabase,
  userId,
}: {
  supabase: SupabaseBrowserClient;
  userId: string;
}) {
  patchCloudStore({
    isHydrated: false,
    isLoading: true,
    mode: "user",
    userId,
  });

  const { data, error } = await supabase
    .from("favorites")
    .select("user_id,event_id,event_snapshot,created_at,updated_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    patchCloudStore({
      events: [],
      favoriteIds: [],
      isHydrated: true,
      isLoading: false,
      mode: "user",
      userId,
    });
    return;
  }

  const rows = Array.isArray(data) ? (data as CloudFavoriteRow[]) : [];
  const events = rowsToEvents(rows);

  setCloudStore({
    events,
    favoriteIds: getFavoriteIds(events),
    isHydrated: true,
    isLoading: false,
    mode: "user",
    userId,
  });

  await migrateLocalFavoritesToCloud({
    existingIds: new Set(rows.map((row) => row.event_id)),
    supabase,
    userId,
  });
}

async function initialiseCloudStore() {
  if (isAuthCheckRunning) {
    return;
  }

  const supabase = createSupabaseBrowserClient();

  if (!supabase) {
    patchCloudStore({
      events: [],
      favoriteIds: [],
      isHydrated: true,
      isLoading: false,
      mode: "guest",
      userId: null,
    });
    return;
  }

  isAuthCheckRunning = true;
  patchCloudStore({
    isHydrated: false,
    isLoading: true,
  });

  const { data, error } = await supabase.auth.getUser();

  isAuthCheckRunning = false;

  const userId = error ? null : (data.user?.id ?? null);

  if (!userId) {
    patchCloudStore({
      events: [],
      favoriteIds: [],
      isHydrated: true,
      isLoading: false,
      mode: "guest",
      userId: null,
    });
    return;
  }

  await loadCloudFavorites({ supabase, userId });
}

async function addCloudFavorite(event: EventCardData) {
  const supabase = createSupabaseBrowserClient();
  const userId = cloudStore.userId;

  if (!supabase || !userId || cloudStore.favoriteIds.includes(event.id)) {
    return;
  }

  const previousStore = cloudStore;
  const events = normaliseEvents([event, ...cloudStore.events]);

  patchCloudStore({
    events,
    favoriteIds: getFavoriteIds(events),
  });

  const row: CloudFavoriteInsert = {
    event_id: event.id,
    event_snapshot: event,
    user_id: userId,
  };

  const { error } = await supabase.from("favorites").insert(row);

  if (error) {
    setCloudStore(previousStore);
  }
}

async function removeCloudFavorite(id: string) {
  const supabase = createSupabaseBrowserClient();
  const userId = cloudStore.userId;

  if (!supabase || !userId || !cloudStore.favoriteIds.includes(id)) {
    return;
  }

  const previousStore = cloudStore;
  const events = cloudStore.events.filter((event) => event.id !== id);

  patchCloudStore({
    events,
    favoriteIds: getFavoriteIds(events),
  });

  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("event_id", id);

  if (error) {
    setCloudStore(previousStore);
  }
}

export function useFavoritesCloud(): UseFavoritesCloudResult {
  const localFavorites = useFavorites();
  const [snapshot, setSnapshot] = useState(cloudStore);

  useEffect(() => subscribe(() => setSnapshot(cloudStore)), []);

  useEffect(() => {
    if (!localFavorites.isHydrated) {
      return;
    }

    if (!snapshot.isHydrated && !snapshot.isLoading) {
      void initialiseCloudStore();
    }
  }, [localFavorites.isHydrated, snapshot.isHydrated, snapshot.isLoading]);

  const localFavoriteEvents = localFavorites.isHydrated
    ? getFavoriteEvents()
    : [];

  const mode = snapshot.mode;
  const favoriteEvents = mode === "user" ? snapshot.events : localFavoriteEvents;
  const favoriteIds = mode === "user" ? snapshot.favoriteIds : localFavorites.favoriteIds;
  const isHydrated =
    localFavorites.isHydrated && (mode === "user" ? snapshot.isHydrated : snapshot.isHydrated);
  const isLoading = mode === "user" ? snapshot.isLoading : !snapshot.isHydrated;

  const isFavorite = useCallback(
    (id: string) => favoriteIds.includes(id),
    [favoriteIds],
  );

  const removeFavorite = useCallback(
    (id: string) => {
      if (!isHydrated) {
        return;
      }

      if (mode === "user") {
        return removeCloudFavorite(id);
      }

      localFavorites.removeFavorite(id);
    },
    [isHydrated, localFavorites, mode],
  );

  const toggleFavoriteEvent = useCallback(
    (event: EventCardData) => {
      if (!isHydrated) {
        return;
      }

      if (mode === "user") {
        if (favoriteIds.includes(event.id)) {
          return removeCloudFavorite(event.id);
        }

        return addCloudFavorite(event);
      }

      localFavorites.toggleFavoriteEvent(event);
    },
    [favoriteIds, isHydrated, localFavorites, mode],
  );

  return {
    favoriteEvents,
    favoriteIds,
    isFavorite,
    isHydrated,
    isLoading,
    mode,
    removeFavorite,
    toggleFavoriteEvent,
  };
}
