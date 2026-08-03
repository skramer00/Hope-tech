-- Hope Technical Ministries content and admin schema
create extension if not exists pgcrypto;

create type public.content_status as enum ('draft', 'published', 'archived');
create type public.safety_level as enum ('volunteer_safe', 'technical_lead', 'administrator_only');
create type public.content_kind as enum ('role', 'device', 'guide', 'troubleshooting', 'assistant_answer');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.content_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text,
  kind public.content_kind not null,
  role_slug text,
  device_slug text,
  status public.content_status not null default 'draft',
  safety public.safety_level not null default 'volunteer_safe',
  sort_order integer not null default 0,
  body jsonb not null default '[]'::jsonb,
  search_terms text[] not null default '{}',
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  published_at timestamptz,
  review_due_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  storage_path text not null unique,
  alt_text text,
  caption text,
  device_slug text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table public.content_revisions (
  id uuid primary key default gen_random_uuid(),
  content_id uuid not null references public.content_items(id) on delete cascade,
  title text not null,
  summary text,
  body jsonb not null,
  changed_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create index content_items_role_idx on public.content_items(role_slug);
create index content_items_kind_status_idx on public.content_items(kind, status);
create index content_items_search_idx on public.content_items using gin(search_terms);

alter table public.profiles enable row level security;
alter table public.content_items enable row level security;
alter table public.media_assets enable row level security;
alter table public.content_revisions enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

create policy "Published content is public"
on public.content_items for select
using (status = 'published' or public.is_admin());

create policy "Admins manage content"
on public.content_items for all
using (public.is_admin())
with check (public.is_admin());

create policy "Users view own profile"
on public.profiles for select
using (id = auth.uid() or public.is_admin());

create policy "Admins manage profiles"
on public.profiles for all
using (public.is_admin())
with check (public.is_admin());

create policy "Admins manage media"
on public.media_assets for all
using (public.is_admin())
with check (public.is_admin());

create policy "Admins view revisions"
on public.content_revisions for select
using (public.is_admin());

create policy "Admins create revisions"
on public.content_revisions for insert
with check (public.is_admin());

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger content_items_set_updated_at before update on public.content_items
for each row execute function public.set_updated_at();

-- Storage bucket should be created after project setup:
-- insert into storage.buckets (id, name, public) values ('guide-media', 'guide-media', true);
