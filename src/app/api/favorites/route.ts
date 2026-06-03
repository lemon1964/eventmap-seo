// src/app/api/favorites/route.ts
import { NextResponse } from "next/server";
import { getEventsByIds } from "@/server/api/events";
import { isLocale, type Locale } from "@/shared/lib/locales";

type FavoritesRequestBody = {
  ids?: unknown;
  locale?: unknown;
};

function isFavoritesRequestBody(value: unknown): value is FavoritesRequestBody {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normaliseIds(value: unknown): string[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normaliseLocale(value: unknown): Locale | null {
  if (typeof value !== "string" || !isLocale(value)) {
    return null;
  }

  return value;
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!isFavoritesRequestBody(body)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const locale = normaliseLocale(body.locale);
  const ids = normaliseIds(body.ids);

  if (!locale || !ids) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (ids.length === 0) {
    return NextResponse.json({ events: [] });
  }

  try {
    const events = await getEventsByIds({ ids, locale });

    return NextResponse.json({ events });
  } catch {
    return NextResponse.json({ error: "Unable to load favorites" }, { status: 500 });
  }
}
