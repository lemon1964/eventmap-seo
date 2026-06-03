-- supabase/sql/001_favorites_rls.sql
-- Module 9.2: cloud favorites table, grants and RLS policies.
-- Run this file in Supabase Studio SQL Editor.

create table if not exists public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  event_id text not null,
  event_snapshot jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, event_id)
);

alter table public.favorites enable row level security;

grant usage on schema public to authenticated;
grant select, insert, delete on table public.favorites to authenticated;

drop policy if exists "favorites_select_own" on public.favorites;
drop policy if exists "favorites_insert_own" on public.favorites;
drop policy if exists "favorites_delete_own" on public.favorites;

create policy "favorites_select_own"
on public.favorites
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "favorites_insert_own"
on public.favorites
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "favorites_delete_own"
on public.favorites
for delete
to authenticated
using ((select auth.uid()) = user_id);
