// src/app/auth/callback/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/client/api/supabase/server";
import { getSafeAuthNext } from "@/features/auth/authRedirect";
import type { Locale } from "@/shared/lib/locales";
import { routes } from "@/shared/lib/routes";

function getLocaleFromNextPath(path: string): Locale {
  return path === "/ru" || path.startsWith("/ru/") ? "ru" : "en";
}

function buildLoginRedirectUrl({
  error,
  request,
  safeNext,
}: {
  error: string;
  request: NextRequest;
  safeNext: string;
}) {
  const locale = getLocaleFromNextPath(safeNext);
  const loginUrl = new URL(routes.login(locale), request.url);
  loginUrl.search = new URLSearchParams({ error, next: safeNext }).toString();

  return loginUrl;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const safeNext = getSafeAuthNext(
    request.nextUrl.searchParams.get("next"),
    routes.favorites("en"),
  );

  if (!code) {
    return NextResponse.redirect(
      buildLoginRedirectUrl({
        error: "missing-code",
        request,
        safeNext,
      }),
    );
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.redirect(
      buildLoginRedirectUrl({
        error: "supabase-not-configured",
        request,
        safeNext,
      }),
    );
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      buildLoginRedirectUrl({
        error: "auth-callback-failed",
        request,
        safeNext,
      }),
    );
  }

  return NextResponse.redirect(new URL(safeNext, request.url));
}
