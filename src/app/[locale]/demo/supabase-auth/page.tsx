// src/app/[locale]/demo/supabase-auth/page.tsx
import Link from "next/link";
import {
  getLocaleFromParams,
  type LocaleParams,
} from "@/shared/lib/localeParams";
import { routes } from "@/shared/lib/routes";

type PageProps = {
  params: LocaleParams;
};

const authFlowCards = [
  {
    title: "Magic Link",
    text: "The user enters an email, Supabase sends a passwordless login link, and EventMap receives the user back through /auth/callback.",
  },
  {
    title: "Google OAuth",
    text: "EventMap starts signInWithOAuth, Google returns the user to Supabase, and Supabase redirects back to EventMap.",
  },
  {
    title: "Callback route",
    text: "The /auth/callback route exchanges the auth code for a Supabase session and then redirects to a safe internal next path.",
  },
  {
    title: "Sign out",
    text: "Sign out clears the Supabase session cookies and sends the user back to the login page.",
  },
];

const setupCards = [
  {
    title: "Supabase URL Configuration",
    text: "Site URL is http://localhost:3000 and Redirect URLs include http://localhost:3000/auth/callback.",
  },
  {
    title: "Google Console callback",
    text: "Google Console uses the Supabase callback URL: https://<project-ref>.supabase.co/auth/v1/callback.",
  },
  {
    title: "EventMap callback",
    text: "EventMap owns /auth/callback. This route is excluded from next-intl middleware and does not include locale in the path.",
  },
];

export default async function SupabaseAuthPage({ params }: PageProps) {
  const locale = await getLocaleFromParams(params);
  const callbackPath = `${routes.authCallback()}?next=${encodeURIComponent(routes.favorites(locale))}`;

  return (
    <section className="container demo-page">
      <div className="demo-hero">
        <h1>Supabase Auth flow</h1>
        <p>
          Magic Link, Google OAuth, safe next redirects, callback route and
          Supabase session cookies as a separate Demo Lab explanation.
        </p>
      </div>

      <div className="app-grid">
        {authFlowCards.map((card) => (
          <article className="app-surface app-stack app-muted-copy" key={card.title}>
            <p className="app-badge">Auth flow</p>
            <h2>{card.title}</h2>
            <p>{card.text}</p>
          </article>
        ))}
      </div>

      <div className="app-surface app-stack app-muted-copy">
        <p className="app-badge">EventMap callback</p>
        <h2>Safe internal redirect</h2>
        <p>
          EventMap accepts only internal next paths. External URLs are rejected
          by getSafeAuthNext before the user is redirected after sign in.
        </p>
        <p className="app-muted-copy">Callback path</p>
        <code className="app-code-text">{callbackPath}</code>
        <p className="app-muted-copy">Next path</p>
        <code className="app-code-text">{routes.favorites(locale)}</code>
      </div>

      <div className="app-grid">
        {setupCards.map((card) => (
          <article className="app-surface app-stack app-muted-copy" key={card.title}>
            <p className="app-badge">Setup</p>
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
      </div>
    </section>
  );
}
