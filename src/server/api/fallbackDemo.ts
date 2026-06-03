// src/server/api/fallbackDemo.ts
import type { EventCardData } from "@/entities/event/types";
import { getFallbackFeaturedEvents } from "@/server/api/events";

export type FallbackDemoMode = "ok" | "empty" | "invalid" | "rate-limit";

export type FallbackDemoResult = {
  mode: FallbackDemoMode;
  status: "live" | "fallback";
  message: string;
  events: EventCardData[];
};

export function getFallbackDemoResult(mode: string): FallbackDemoResult {
  const safeMode = isFallbackDemoMode(mode) ? mode : "ok";
  const fallbackEvents = getFallbackFeaturedEvents();

  if (safeMode === "ok") {
    return {
      mode: safeMode,
      status: "live",
      message: "External data passed the safety checks.",
      events: fallbackEvents.slice(0, 3),
    };
  }

  if (safeMode === "empty") {
    return {
      mode: safeMode,
      status: "fallback",
      message: "External API returned an empty list.",
      events: [],
    };
  }

  const messages: Record<Exclude<FallbackDemoMode, "ok" | "empty">, string> = {
    invalid: "External API returned an unexpected shape. EventMap shows fallback data.",
    "rate-limit": "External API rate limit was reached. EventMap shows fallback data.",
  };

  return {
    mode: safeMode,
    status: "fallback",
    message: messages[safeMode],
    events: fallbackEvents,
  };
}

function isFallbackDemoMode(mode: string): mode is FallbackDemoMode {
  return ["ok", "empty", "invalid", "rate-limit"].includes(mode);
}
