// src/shared/lib/returnTo.ts
import type { Locale } from "@/shared/lib/locales";

type SearchParamsInput = Record<string, string | string[] | undefined>;

type GetSafeReturnToInput = {
  fallback: string;
  locale: Locale;
  searchParams: SearchParamsInput;
};

function getFirstValue(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

export function getSafeReturnTo({
  fallback,
  locale,
  searchParams,
}: GetSafeReturnToInput): string {
  const returnTo = getFirstValue(searchParams.returnTo);

  if (!returnTo) {
    return fallback;
  }

  if (returnTo !== `/${locale}` && !returnTo.startsWith(`/${locale}/`)) {
    return fallback;
  }

  try {
    const parsed = new URL(returnTo, "https://eventmap.local");

    if (parsed.origin !== "https://eventmap.local") {
      return fallback;
    }

    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
}
