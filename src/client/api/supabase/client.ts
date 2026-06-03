// src/client/api/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfig } from "@/client/api/supabase/env";

export function createSupabaseBrowserClient() {
  const config = getSupabaseConfig();

  if (!config) {
    return null;
  }

  return createBrowserClient(config.url, config.publishableKey);
}
