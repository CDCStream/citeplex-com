-- ============================================================
-- CitePlex — blog (Outrank.so auto-published posts)
-- Run in Supabase: SQL Editor → paste → Run (after 0001_init.sql)
-- ============================================================

create table if not exists public.blog_posts (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  description text default '',
  content text default '',
  image text default '',
  tags text[] default '{}',
  author text default 'Outrank',
  status text default 'published',
  published_at timestamptz default now(),
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

create index if not exists idx_blog_posts_status on public.blog_posts (status);
create index if not exists idx_blog_posts_slug on public.blog_posts (slug);
create index if not exists idx_blog_posts_published_at on public.blog_posts (published_at desc);

-- RLS: published posts are publicly readable; writes happen only via the
-- service-role key (webhook / admin save), which bypasses RLS entirely.
alter table public.blog_posts enable row level security;

drop policy if exists "blog_public_read_published" on public.blog_posts;
create policy "blog_public_read_published"
  on public.blog_posts for select
  using (status = 'published');
