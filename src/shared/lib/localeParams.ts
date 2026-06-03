// src/shared/lib/localeParams.ts
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/shared/lib/locales";

export type LocaleParams = Promise<{
  locale: string;
}>;

export async function getLocaleFromParams(
  params: LocaleParams,
): Promise<Locale> {
  const { locale } = await params;

  // URL is external input, so even the [locale] segment is validated.
  if (!isLocale(locale)) {
    notFound();
  }

  return locale;
}
