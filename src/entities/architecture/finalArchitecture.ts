// src/entities/architecture/finalArchitecture.ts
export type ArchitectureCard = {
    title: string;
    text: string;
  };
  
  export type ArchitectureRoute = {
    path: string;
    role: string;
  };
  
  export const productRoutes: ArchitectureRoute[] = [
    {
      path: "/[locale]",
      role: "Product home page: localized hero, featured events and live event entry point.",
    },
    {
      path: "/[locale]/search",
      role: "Server-rendered search page with URL filters, metadata and live source fallback.",
    },
    {
      path: "/[locale]/search/[category]",
      role: "Clean SEO search landing page produced from optional catch-all search segments.",
    },
    {
      path: "/[locale]/events/[id]",
      role: "Event detail page shared by full page and modal flows through EventDetails.",
    },
    {
      path: "/[locale]/favorites",
      role: "Favorites product page: localStorage for guests and Supabase cloud rows for users.",
    },
    {
      path: "/[locale]/login",
      role: "Auth entry page with Magic Link, Google OAuth and sign out for the course project.",
    },
  ];
  
  export const demoRoutes: ArchitectureRoute[] = [
    {
      path: "/[locale]/demo",
      role: "Demo Lab index: navigation hub for course patterns and architecture checkpoints.",
    },
    {
      path: "/[locale]/demo/*",
      role: "Isolated demo pages that explain patterns without adding debug content to product routes.",
    },
  ];
  
  export const architectureLayers: ArchitectureCard[] = [
    {
      title: "app",
      text: "Routing, layouts, server pages, route handlers and App Router composition live here.",
    },
    {
      title: "entities",
      text: "Domain concepts, typed data, route maps, search helpers, SEO helpers and pure architecture data.",
    },
    {
      title: "server",
      text: "Server-only boundaries for external APIs, cache policy and data normalization before UI rendering.",
    },
    {
      title: "client",
      text: "Browser-safe API clients such as the Supabase browser client boundary.",
    },
    {
      title: "features",
      text: "Product behavior such as auth forms, event sections, search controls and favorites logic.",
    },
    {
      title: "shared",
      text: "Reusable UI primitives, route helpers, locale helpers and utilities that do not own product behavior.",
    },
  ];
  
  export const importRules: ArchitectureCard[] = [
    {
      title: "app composes",
      text: "App routes compose features, entities and shared UI. They should stay thin and route-focused.",
    },
    {
      title: "features use stable boundaries",
      text: "Features can use entities, shared utilities and client API boundaries when browser behavior is required.",
    },
    {
      title: "server stays server-only",
      text: "Server API code and external keys must not be imported into Client Components or browser hooks.",
    },
    {
      title: "client APIs stay explicit",
      text: "Browser API clients stay in the client layer and are imported only where that boundary is safe.",
    },
    {
      title: "shared stays reusable",
      text: "Shared UI and utilities should not depend on product features or page-specific behavior.",
    },
  ];
  
  export const serverClientBoundaries: ArchitectureCard[] = [
    {
      title: "Server pages fetch and compose",
      text: "Home, search, detail and demo pages can render data on the server and pass ready data into UI.",
    },
    {
      title: "Client islands handle interaction",
      text: "FavoriteButton and AuthFormClient isolate browser interaction without turning whole pages into client code.",
    },
    {
      title: "useFavoritesCloud is a browser hook",
      text: "The hook chooses guest localStorage or Supabase cloud favorites after hydration and current user lookup.",
    },
    {
      title: "EventCard remains reusable UI",
      text: "EventCard displays server-rendered event data and can host a small client island for favorite toggling.",
    },
  ];
  
  export const systemContracts: ArchitectureCard[] = [
    {
      title: "Locale contract",
      text: "Locale is explicit in route params, links, metadata, alternate URLs and server calls.",
    },
    {
      title: "SEO contract",
      text: "Metadata, canonical URLs, hreflang, sitemap and robots are produced through dedicated helpers and routes.",
    },
    {
      title: "Zod contract",
      text: "Ticketmaster data is validated before EventMap normalizes it into internal EventCardData.",
    },
    {
      title: "Search URL contract",
      text: "Path segments and searchParams are parsed before filters, pagination or metadata are derived from them.",
    },
    {
      title: "Supabase RLS contract",
      text: "The publishable key is safe only because Row Level Security protects each user row in public.favorites.",
    },
  ];
  
  export const authUxNotes: ArchitectureCard[] = [
    {
      title: "Current auth minimum",
      text: "EventMap has Magic Link, Google OAuth, /auth/callback, localized login pages and sign out on the login page.",
    },
    {
      title: "Not full account UX",
      text: "The project does not add a profile page, account dropdown, username in the header, avatar or settings page.",
    },
    {
      title: "Later product path",
      text: "A fuller product could add account menu, profile and settings while keeping the existing Supabase auth boundary.",
    },
  ];
  
  export const backendEvolutionNotes: ArchitectureCard[] = [
    {
      title: "Supabase path",
      text: "Supabase stays the managed backend option for Auth, RLS, cloud state and the public.favorites table.",
    },
    {
      title: "Django CMS / DRF path",
      text: "Django can replace the backend contour when the project needs editorial CMS, custom admin, business logic and controlled data ownership.",
    },
    {
      title: "Frontend patterns stay reusable",
      text: "Locale routing, server-rendered search, metadata, client islands and data normalization remain useful with either backend line.",
    },
  ];
  