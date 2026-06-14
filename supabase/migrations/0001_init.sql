-- ============================================================
-- CitePlex — initial schema (profiles, projects, citations, activity)
-- Run in Supabase: SQL Editor → paste → Run
-- ============================================================

-- ── Helper: keep updated_at fresh ──────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── profiles ───────────────────────────────────────────────
-- 1:1 with auth.users. Stores plan + monthly usage counter.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  plan text not null default 'free' check (plan in ('free', 'pro', 'team')),
  citation_count integer not null default 0,
  citation_count_reset_at timestamptz not null default date_trunc('month', now()) + interval '1 month',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ── projects (folders for organizing citations) ────────────
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  color text default '#f59e0b',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

create index if not exists projects_user_id_idx on public.projects (user_id);

-- ── citations (saved references) ───────────────────────────
create table if not exists public.citations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  project_id uuid references public.projects (id) on delete set null,
  style text not null,
  source_type text not null,
  source_data jsonb not null default '{}'::jsonb,
  formatted text not null,
  in_text text,
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists citations_set_updated_at on public.citations;
create trigger citations_set_updated_at
  before update on public.citations
  for each row execute function public.set_updated_at();

create index if not exists citations_user_id_idx on public.citations (user_id);
create index if not exists citations_project_id_idx on public.citations (project_id);
create index if not exists citations_created_at_idx on public.citations (created_at desc);

-- ── activity_log (user actions) ────────────────────────────
create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists activity_log_user_id_idx on public.activity_log (user_id, created_at desc);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.profiles     enable row level security;
alter table public.projects     enable row level security;
alter table public.citations    enable row level security;
alter table public.activity_log enable row level security;

-- profiles: owner can read/update own row (insert handled by trigger)
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- projects: full ownership
drop policy if exists "projects_all_own" on public.projects;
create policy "projects_all_own" on public.projects
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- citations: full ownership
drop policy if exists "citations_all_own" on public.citations;
create policy "citations_all_own" on public.citations
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- activity_log: owner can read + insert their own events
drop policy if exists "activity_select_own" on public.activity_log;
create policy "activity_select_own" on public.activity_log
  for select using (auth.uid() = user_id);

drop policy if exists "activity_insert_own" on public.activity_log;
create policy "activity_insert_own" on public.activity_log
  for insert with check (auth.uid() = user_id);

-- ============================================================
-- Auto-create profile on signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Monthly usage helper: increments counter, resets if month passed.
-- Returns the new count. Used by the app to enforce free-tier limits.
-- ============================================================
create or replace function public.increment_citation_count(p_user_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  update public.profiles
    set citation_count = case
          when citation_count_reset_at <= now() then 1
          else citation_count + 1
        end,
        citation_count_reset_at = case
          when citation_count_reset_at <= now()
            then date_trunc('month', now()) + interval '1 month'
          else citation_count_reset_at
        end
    where id = p_user_id
    returning citation_count into v_count;
  return v_count;
end;
$$;
