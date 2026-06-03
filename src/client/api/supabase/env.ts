// src/client/api/supabase/env.ts
export type SupabaseConfig = {
  publishableKey: string;
  url: string;
};

function getSupabaseUrl(): string {
  return (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
}

function getSupabasePublishableKey(): string {
  return (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "").trim();
}

export function getSupabaseConfig(): SupabaseConfig | null {
  const url = getSupabaseUrl();
  const publishableKey = getSupabasePublishableKey();

  if (!url || !publishableKey) {
    return null;
  }

  return {
    publishableKey,
    url,
  };
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseConfig() !== null;
}

export function getSupabaseEnvStatus() {
  return {
    hasPublishableKey: Boolean(getSupabasePublishableKey()),
    hasUrl: Boolean(getSupabaseUrl()),
    names: [
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    ],
  };
}
