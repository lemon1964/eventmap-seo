// src/entities/renderingStrategy/strategies.ts
export type RenderingMode =
  | "static"
  | "dynamic"
  | "isr"
  | "no-store"
  | "client";

export type RenderingStrategyItem = {
  id: string;
  route: string;
  role: string;
  dataSource: string;
  strategy: RenderingMode;
  cachePolicy: string;
  reason: string;
};

// Это учебная архитектурная карта, а не runtime config для роутера.
export const renderingStrategyItems: RenderingStrategyItem[] = [
  {
    id: "home",
    route: "/[locale]",
    role: "Localized landing page with featured events",
    dataSource: "controlled content source",
    strategy: "isr",
    cachePolicy: "controlled content, future revalidate",
    reason:
      "The page is useful for SEO and should not depend on live Ticketmaster data during build.",
  },
  {
    id: "event-detail",
    route: "/[locale]/events/[id]",
    role: "Event detail page",
    dataSource: "controlled content source",
    strategy: "static",
    cachePolicy: "generateStaticParams + dynamicParams=false",
    reason:
      "Known content pages can be generated ahead of time from controlled ids.",
  },
  {
    id: "search",
    route: "/[locale]/search",
    role: "Live search page",
    dataSource: "live Ticketmaster source",
    strategy: "dynamic",
    cachePolicy: "fetch revalidate + tags",
    reason:
      "Search depends on user filters and live external data, so it should not be frozen as a small static list.",
  },
  {
    id: "demo",
    route: "/[locale]/demo/*",
    role: "Learning labs",
    dataSource: "demo data",
    strategy: "no-store",
    cachePolicy: "demo-specific, preview-friendly",
    reason:
      "Demo pages explain mechanisms and can opt out of cache when they imitate preview scenarios.",
  },
  {
    id: "favorites",
    route: "/[locale]/favorites",
    role: "Saved events page",
    dataSource: "client state now, cloud state later",
    strategy: "client",
    cachePolicy: "browser state now, cloud policy later",
    reason:
      "Favorites belong to user state and will later move from localStorage to cloud storage.",
  },
];
