// src/client/api/supabase/rlsChecklist.ts
export type SupabaseRlsChecklistItem = {
    title: string;
    text: string;
  };
  
  export const supabaseRlsChecklist: SupabaseRlsChecklistItem[] = [
    {
      title: "favorites table shape",
      text: "public.favorites stores user_id, event_id and event_snapshot for each saved event.",
    },
    {
      title: "RLS enabled",
      text: "Row Level Security is enabled before browser-facing access is allowed.",
    },
    {
      title: "authenticated grants",
      text: "The authenticated role receives select, insert and delete grants for public.favorites.",
    },
    {
      title: "SELECT own rows",
      text: "The SELECT policy compares auth.uid() with user_id.",
    },
    {
      title: "INSERT own rows",
      text: "The INSERT policy uses with check so a user can only create rows for their own user_id.",
    },
    {
      title: "DELETE own rows",
      text: "The DELETE policy compares auth.uid() with user_id before removing a favorite.",
    },
    {
      title: "publishable key paired with RLS",
      text: "The browser client uses a publishable key, while row access stays protected by grants and policies.",
    },
  ];
  