// src/app/[locale]/layout.tsx
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { locales } from "@/shared/lib/locales";
import { getLocaleFromParams, type LocaleParams } from "@/shared/lib/localeParams";
import { siteConfig } from "@/entities/seo/siteConfig";
import { PageShell } from "@/shared/ui/PageShell";
import "../globals.css";
import { HydrationProbe } from "@/shared/ui/HydrationProbe";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "EventMap",
    template: "%s | EventMap",
  },
  description: "Find live events, concerts, sports, theatre and film.",
  icons: {
    icon: [{ url: "/favicon.ico" }],
  },
};
// export const metadata: Metadata = {
//   title: {
//     default: "EventMap",
//     template: "%s | EventMap",
//   },
//   description: "Find live events, concerts, sports, theatre and film.",
// };

type LocaleLayoutProps = {
  children: React.ReactNode;
  modal: React.ReactNode;
  params: LocaleParams;
};

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export default async function LocaleLayout({ children, modal, params }: LocaleLayoutProps) {
  const locale = await getLocaleFromParams(params);

  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <html lang={locale}>
      <body>
        <HydrationProbe label="OUTSIDE" />

        <NextIntlClientProvider locale={locale} messages={messages}>
          <HydrationProbe label="INSIDE" />

          <PageShell locale={locale}>{children}</PageShell>
          {modal}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
