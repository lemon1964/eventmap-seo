// src/features/favorites/cloudFavoriteTypes.ts
import type { EventCardData } from "@/entities/event/types";

export type CloudFavoriteRow = {
  user_id: string;
  event_id: string;
  event_snapshot: EventCardData;
  created_at: string;
  updated_at: string;
};

export type CloudFavoriteInsert = {
  user_id: string;
  event_id: string;
  event_snapshot: EventCardData;
};

export type CloudFavoriteDelete = {
  user_id: string;
  event_id: string;
};

export type CloudFavoriteMode = "guest" | "user";

export type CloudFavoriteState = {
  events: EventCardData[];
  favoriteIds: string[];
  isHydrated: boolean;
  isLoading: boolean;
  mode: CloudFavoriteMode;
};

export type CloudFavoritesResponse = {
  favorites: CloudFavoriteRow[];
};
