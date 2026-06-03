// src/app/[locale]/demo/supabase-cloud-favorites/page.tsx
import Link from "next/link";
import {
  getLocaleFromParams,
  type LocaleParams,
} from "@/shared/lib/localeParams";
import { routes } from "@/shared/lib/routes";

type PageProps = {
  params: LocaleParams;
};

const modeCards = [
  {
    title: "Guest mode",
    text: "A visitor without a Supabase session keeps using eventmap:favorites and eventmap:favorite-events in localStorage.",
  },
  {
    title: "User mode",
    text: "An authenticated user reads and writes public.favorites through the browser client and RLS-scoped policies.",
  },
  {
    title: "Copy migration",
    text: "On first sign in, cached local EventCardData snapshots are copied to Supabase. The local cache stays in place as guest fallback.",
  },
];

const crudCards = [
  {
    title: "SELECT",
    text: "useFavoritesCloud loads event_id and event_snapshot from public.favorites. RLS limits the result to the current auth.uid().",
  },
  {
    title: "INSERT",
    text: "Saving an event inserts user_id, event_id and event_snapshot. No upsert is used because this lesson has no UPDATE policy.",
  },
  {
    title: "DELETE",
    text: "Removing a favorite deletes the matching user_id and event_id row, then the UI updates optimistically.",
  },
];

const productBoundaryCards = [
  {
    title: "Product page",
    text: "/favorites stays a normal EventMap page. It shows events, empty state and a link back to search.",
  },
  {
    title: "Client island",
    text: "FavoriteButton remains the small client island inside server-rendered event cards.",
  },
  {
    title: "Demo Lab",
    text: "SQL, RLS and CRUD explanations stay here instead of leaking into product UI.",
  },
];

export default async function SupabaseCloudFavoritesPage({
  params,
}: PageProps) {
  const locale = await getLocaleFromParams(params);

  return (
    <section className="container demo-page">
      <div className="demo-hero">
        <h1>Supabase Cloud Favorites</h1>
        <p>
          EventMap now switches favorites by auth state: guests keep browser
          persistence, authenticated users use the Supabase favorites table.
        </p>
      </div>

      <div className="app-grid">
        {modeCards.map((card) => (
          <article className="app-surface app-stack app-muted-copy" key={card.title}>
            <p className="app-badge">Mode</p>
            <h2>{card.title}</h2>
            <p>{card.text}</p>
          </article>
        ))}
      </div>

      <div className="app-surface app-stack app-muted-copy">
        <p className="app-badge">Hook boundary</p>
        <h2>useFavoritesCloud</h2>
        <p>
          The hook reads the current Supabase user in the browser after
          hydration. If there is no configured client or no user session, it
          delegates to the existing localStorage favorites hook.
        </p>
        <code className="app-code-text">
          guest localStorage → login → copy snapshots → cloud favorites
        </code>
      </div>

      <div className="app-grid">
        {crudCards.map((card) => (
          <article className="app-surface app-stack app-muted-copy" key={card.title}>
            <p className="app-badge">CRUD</p>
            <h2>{card.title}</h2>
            <p>{card.text}</p>
          </article>
        ))}
      </div>

      <div className="app-grid">
        {productBoundaryCards.map((card) => (
          <article className="app-surface app-stack app-muted-copy" key={card.title}>
            <p className="app-badge">Boundary</p>
            <h2>{card.title}</h2>
            <p>{card.text}</p>
          </article>
        ))}
      </div>

      <div className="app-cluster">
        <Link className="button button--secondary" href={routes.demo(locale)}>
          Back to Demo Lab
        </Link>
        <Link className="button button--secondary" href={routes.login(locale)}>
          Open Login
        </Link>
        <Link className="button button--secondary" href={routes.favorites(locale)}>
          Open Favorites
        </Link>
        <Link
          className="button button--secondary"
          href={routes.demoSupabaseRls(locale)}
        >
          Supabase RLS
        </Link>
      </div>
    </section>
  );
}
