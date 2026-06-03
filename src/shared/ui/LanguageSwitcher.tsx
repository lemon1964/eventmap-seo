// src/shared/ui/LanguageSwitcher.tsx
"use client";

import { usePathname, useSearchParams } from "next/navigation";
import type { Locale } from "@/shared/lib/locales";
import { isLocale, locales } from "@/shared/lib/locales";

type LanguageSwitcherProps = {
  locale: Locale;
};

function getLocalizedHref(pathname: string, targetLocale: Locale, query: string) {
  const segments = pathname.split("/").filter(Boolean);
  const pathSegments = isLocale(segments[0] ?? "") ? segments.slice(1) : segments;
  const localizedPath = `/${[targetLocale, ...pathSegments].join("/")}`;

  return query ? `${localizedPath}?${query}` : localizedPath;
}

export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  return (
    <div className="nav__locale" aria-label="Language switcher">
      {locales.map((targetLocale) => (
        <a
          aria-current={targetLocale === locale ? "page" : undefined}
          className={
            targetLocale === locale
              ? "nav__locale-link nav__locale-link--active"
              : "nav__locale-link"
          }
          href={getLocalizedHref(pathname, targetLocale, query)}
          key={targetLocale}
        >
          {targetLocale.toUpperCase()}
        </a>
      ))}
    </div>
  );
}
