// src/app/[locale]/demo/supabase-rls/page.tsx
import Link from "next/link";
import { supabaseRlsChecklist } from "@/client/api/supabase/rlsChecklist";
import {
  getLocaleFromParams,
  type LocaleParams,
} from "@/shared/lib/localeParams";
import { routes } from "@/shared/lib/routes";

type PageProps = {
  params: LocaleParams;
};

const tableFields = [
  {
    name: "user_id",
    text: "Supabase Auth user id. Each row belongs to one authenticated account.",
  },
  {
    name: "event_id",
    text: "EventMap event id. Together with user_id it forms the primary key.",
  },
  {
    name: "event_snapshot",
    text: "A JSON snapshot of EventCardData for future cloud favorites UI.",
  },
  {
    name: "created_at / updated_at",
    text: "Server timestamps for storage metadata.",
  },
];

const policyCards = [
  {
    title: "SELECT",
    text: "Authenticated users can read only rows where auth.uid() equals user_id.",
  },
  {
    title: "INSERT",
    text: "with check prevents a browser request from creating a row for another user.",
  },
  {
    title: "DELETE",
    text: "A user can remove only their own favorite rows.",
  },
];

export default async function SupabaseRlsPage({ params }: PageProps) {
  const locale = await getLocaleFromParams(params);

  return (
    <section className="container demo-page">
      <div className="demo-hero">
        <p className="hero__eyebrow">Module 9.2</p>
        <h1>Supabase favorites table and RLS</h1>
        <p>
          This Demo Lab page documents the cloud storage boundary for future
          favorites. EventMap does not read or write cloud favorites yet.
        </p>
      </div>

      <div className="app-surface app-stack app-muted-copy">
        <p className="app-badge">SQL migration</p>
        <h2>Run the SQL file in Supabase Studio</h2>
        <p>
          Copy the project SQL file into Supabase Studio SQL Editor and run it
          against the course project database.
        </p>
        <code className="app-code-text">supabase/sql/001_favorites_rls.sql</code>
      </div>

      <div className="app-grid">
        {tableFields.map((field) => (
          <article className="app-surface app-stack app-muted-copy" key={field.name}>
            <p className="app-badge">favorites</p>
            <h2 className="app-code-text">{field.name}</h2>
            <p>{field.text}</p>
          </article>
        ))}
      </div>

      <div className="app-grid">
        {policyCards.map((policy) => (
          <article className="app-surface app-stack app-muted-copy" key={policy.title}>
            <p className="app-badge">RLS policy</p>
            <h2>{policy.title}</h2>
            <p>{policy.text}</p>
          </article>
        ))}
      </div>

      <div className="app-surface app-stack app-muted-copy">
        <p className="app-badge">RLS checklist</p>
        <h2>What must be true before browser access is safe</h2>
        <div className="app-stack">
          {supabaseRlsChecklist.map((item) => (
            <article className="app-stack" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="app-surface app-stack app-muted-copy">
        <p className="app-badge">Publishable key + RLS</p>
        <h2>The key can be public, the rows cannot</h2>
        <p>
          A publishable key is expected in the browser client. It is safe only
          when the table grants are narrow and RLS policies scope every row to
          the current auth.uid(). Secret or service-role keys never belong in a
          Next.js frontend.
        </p>
      </div>

      <div className="app-cluster">
        <Link className="button button--secondary" href={routes.demo(locale)}>
          Back to Demo Lab
        </Link>
        <Link
          className="button button--secondary"
          href={routes.demoSupabaseArchitecture(locale)}
        >
          Supabase architecture
        </Link>
        <Link className="button button--secondary" href={routes.favorites(locale)}>
          Open Favorites
        </Link>
      </div>
    </section>
  );
}
