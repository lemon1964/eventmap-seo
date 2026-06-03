// src/app/[locale]/demo/supabase-architecture/page.tsx
import Link from "next/link";
import { getSupabaseArchitectureStatus } from "@/client/api/supabase/status";
import {
  getLocaleFromParams,
  type LocaleParams,
} from "@/shared/lib/localeParams";
import { routes } from "@/shared/lib/routes";

type PageProps = {
  params: LocaleParams;
};

const architectureCards = [
  {
    title: "Managed Postgres",
    text: "EventMap will store account-based favorites in a managed relational database.",
  },
  {
    title: "Auth",
    text: "Future lessons can identify the current user before reading cloud favorites.",
  },
  {
    title: "Auto REST API",
    text: "Supabase exposes database tables through an API instead of becoming an ORM inside EventMap.",
  },
  {
    title: "RLS",
    text: "Row Level Security will keep user data scoped to the authenticated account.",
  },
];

export default async function SupabaseArchitecturePage({ params }: PageProps) {
  const locale = await getLocaleFromParams(params);
  const status = getSupabaseArchitectureStatus();
  const statusLabel = status.isConfigured ? "Configured" : "Not configured";

  return (
    <section className="container demo-page">
      <div className="demo-hero">
        <p className="hero__eyebrow">Module 9</p>
        <h1>Supabase architecture</h1>
        <p>
          Supabase enters EventMap as infrastructure for Postgres, Auth, API and
          RLS. This lesson prepares clients and env boundaries only.
        </p>
      </div>

      <div className="app-grid">
        {architectureCards.map((card) => (
          <article className="app-surface app-stack app-muted-copy" key={card.title}>
            <h2>{card.title}</h2>
            <p>{card.text}</p>
          </article>
        ))}
      </div>

      <div className="app-surface app-stack">
        <p className="hero__eyebrow">Configuration status</p>
        <h2>{statusLabel}</h2>
        <div className="app-cluster">
          <span className={status.hasUrl ? "app-chip app-chip--active" : "app-chip"}>
            URL {status.hasUrl ? "ready" : "missing"}
          </span>
          <span
            className={
              status.hasPublishableKey ? "app-chip app-chip--active" : "app-chip"
            }
          >
            Publishable key {status.hasPublishableKey ? "ready" : "missing"}
          </span>
        </div>
        <div className="app-stack app-muted-copy">
          {status.envNames.map((name) => (
            <code className="app-code-text" key={name}>
              {name}
            </code>
          ))}
        </div>
      </div>

      <div className="app-grid">
        <article className="app-surface app-stack app-muted-copy">
          <p className="app-badge">Browser client</p>
          <h2>Client Components</h2>
          <p>
            `createSupabaseBrowserClient` is prepared for future client
            components such as login UI and user-facing cloud favorites.
          </p>
        </article>
        <article className="app-surface app-stack app-muted-copy">
          <p className="app-badge">Server client</p>
          <h2>Server boundaries</h2>
          <p>
            `createSupabaseServerClient` is prepared for server components,
            route handlers and future auth callback work.
          </p>
        </article>
      </div>

      <div className="app-cluster">
        <Link className="button button--secondary" href={routes.demo(locale)}>
          Back to Demo Lab
        </Link>
        <Link className="button button--secondary" href={routes.favorites(locale)}>
          Open Favorites
        </Link>
        <Link className="button button--secondary" href={routes.search(locale)}>
          Open Search
        </Link>
      </div>
    </section>
  );
}
