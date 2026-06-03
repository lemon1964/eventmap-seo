// src/i18n/request.ts
import { getRequestConfig } from "next-intl/server";
import { defaultLocale, isLocale } from "@/shared/lib/locales";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = requested && isLocale(requested) ? requested : defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
