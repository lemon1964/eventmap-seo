// src/features/auth/AuthFormClient.tsx
"use client";

import type { SyntheticEvent } from "react";
import { useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/client/api/supabase/client";
import { getAuthCallbackUrl } from "@/features/auth/authRedirect";
import type { Locale } from "@/shared/lib/locales";

type AuthFormClientProps = {
  initialUserEmail: string | null;
  locale: Locale;
  nextPath: string;
};

export function AuthFormClient({
  initialUserEmail,
  locale,
  nextPath,
}: AuthFormClientProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const getRedirectTo = () => getAuthCallbackUrl(window.location.origin, nextPath);

  async function handleMagicLink(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }

    setIsPending(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: getRedirectTo(),
      },
    });

    setIsPending(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("Check your email for the login link.");
  }

  async function handleGoogleSignIn() {
    setMessage(null);
    setError(null);

    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: getRedirectTo(),
      },
    });

    if (error) {
      setError(error.message);
    }
  }

  async function handleSignOut() {
    setMessage(null);
    setError(null);

    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }

    const { error } = await supabase.auth.signOut();

    if (error) {
      setError(error.message);
      return;
    }

    window.location.href = `/${locale}/login`;
  }

  if (initialUserEmail) {
    return (
      <div className="app-stack">
        <div className="app-surface app-stack">
          <p className="app-muted-copy">Signed in as</p>
          <strong>{initialUserEmail}</strong>
          <button className="button button--secondary" onClick={handleSignOut} type="button">
            Sign out
          </button>
        </div>

        {error ? <p className="app-badge">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className="app-stack">
      {!supabase ? (
        <p className="app-muted-copy">Supabase is not configured.</p>
      ) : null}

      <form className="app-surface app-stack" onSubmit={handleMagicLink}>
        <div className="app-stack">
          <label htmlFor="auth-email">Email</label>
          <input
            className="home-search-form__input"
            disabled={!supabase || isPending}
            id="auth-email"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
            type="email"
            value={email}
          />
        </div>

        <button className="button" disabled={!supabase || isPending} type="submit">
          {isPending ? "Sending..." : "Send Magic Link"}
        </button>
      </form>

      <div className="app-surface app-stack">
        <p className="app-muted-copy">Google OAuth</p>
        <button
          className="button button--secondary"
          disabled={!supabase}
          onClick={handleGoogleSignIn}
          type="button"
        >
          Continue with Google
        </button>
      </div>

      {message ? <p className="app-badge">{message}</p> : null}
      {error ? <p className="app-badge">{error}</p> : null}
    </div>
  );
}
