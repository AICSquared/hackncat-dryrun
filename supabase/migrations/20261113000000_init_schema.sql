-- Shared tables for every track. Track-specific tables go in their own migration,
-- named with the track prefix (rtx_, cisco_, amat_, sandia_, lenovo_, medtronic_).
-- Rule: every table has Row Level Security on, with policies on auth.uid().

create extension if not exists pgcrypto;

-- Background work: created by a Server Action, finished by Next.js after() or the Render worker.
create table public.jobs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  track       text not null check (track in ('rtx','cisco','amat','sandia','lenovo','medtronic','shared')),
  kind        text not null,
  input       jsonb not null default '{}'::jsonb,
  status      text not null default 'queued' check (status in ('queued','running','done','failed')),
  result      jsonb,
  error       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index jobs_user_created_idx on public.jobs (user_id, created_at desc);

alter table public.jobs enable row level security;

create policy "Users read their own jobs"
  on public.jobs for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users create their own jobs"
  on public.jobs for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users update their own jobs"
  on public.jobs for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users delete their own jobs"
  on public.jobs for delete to authenticated
  using ((select auth.uid()) = user_id);

-- Keep updated_at honest.
create or replace function public.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;

create trigger jobs_touch_updated_at before update on public.jobs
  for each row execute function public.touch_updated_at();

-- Template for a track table (copy into a new migration and rename):
-- create table public.lenovo_readings (
--   id uuid primary key default gen_random_uuid(),
--   user_id uuid not null references auth.users (id) on delete cascade,
--   created_at timestamptz not null default now()
-- );
-- alter table public.lenovo_readings enable row level security;
-- create policy "own rows" on public.lenovo_readings for all to authenticated
--   using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
