-- ============================================================
-- CitePlex — payments (Dodo Payments subscription linkage)
-- Run in Supabase: SQL Editor → paste → Run (after 0001_init.sql)
-- ============================================================

-- Link a profile to its Dodo customer + subscription, and track status.
alter table public.profiles
  add column if not exists dodo_customer_id text,
  add column if not exists dodo_subscription_id text,
  add column if not exists plan_status text,            -- active | on_hold | cancelled | expired | failed
  add column if not exists plan_renews_at timestamptz;  -- next billing / expiry

create index if not exists profiles_dodo_customer_idx on public.profiles (dodo_customer_id);

-- Webhook updates run with the service role (bypasses RLS), so no extra
-- policies are needed. The existing "profiles_update_own" policy still blocks
-- users from changing their own plan from the client.
