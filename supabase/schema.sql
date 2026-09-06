-- Rich Girl Bodied — Supabase schema
-- Run this in the Supabase SQL editor (or via `supabase db push`) on a fresh project.
-- Storage buckets ("references" and "generations") must be created separately — see
-- the "Storage" section at the bottom of this file.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  unique (user_id)
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = user_id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = user_id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- characters ("My Girls" projects)
-- ---------------------------------------------------------------------------
create table if not exists public.characters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  primary_reference_url text,
  created_at timestamptz not null default now()
);

alter table public.characters enable row level security;

create policy "characters_select_own" on public.characters
  for select using (auth.uid() = user_id);
create policy "characters_insert_own" on public.characters
  for insert with check (auth.uid() = user_id);
create policy "characters_update_own" on public.characters
  for update using (auth.uid() = user_id);
create policy "characters_delete_own" on public.characters
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- character_references (uploaded identity-anchor images)
-- ---------------------------------------------------------------------------
create table if not exists public.character_references (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references public.characters (id) on delete cascade,
  image_url text not null,
  position int not null default 0,
  reference_type text not null default 'front'
    check (reference_type in ('front', 'side', 'back', 'face', 'other')),
  created_at timestamptz not null default now()
);

alter table public.character_references enable row level security;

create policy "character_references_select_own" on public.character_references
  for select using (
    exists (
      select 1 from public.characters c
      where c.id = character_references.character_id and c.user_id = auth.uid()
    )
  );
create policy "character_references_insert_own" on public.character_references
  for insert with check (
    exists (
      select 1 from public.characters c
      where c.id = character_references.character_id and c.user_id = auth.uid()
    )
  );
create policy "character_references_update_own" on public.character_references
  for update using (
    exists (
      select 1 from public.characters c
      where c.id = character_references.character_id and c.user_id = auth.uid()
    )
  );
create policy "character_references_delete_own" on public.character_references
  for delete using (
    exists (
      select 1 from public.characters c
      where c.id = character_references.character_id and c.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- body_sessions (a single consultation: body settings + locked traits)
-- ---------------------------------------------------------------------------
create table if not exists public.body_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  character_id uuid references public.characters (id) on delete set null,
  body_settings_json jsonb not null default '{}'::jsonb,
  locked_traits_json jsonb not null default '{}'::jsonb,
  status text not null default 'draft'
    check (status in ('draft', 'submitted', 'generating', 'completed', 'failed')),
  created_at timestamptz not null default now()
);

alter table public.body_sessions enable row level security;

create policy "body_sessions_select_own" on public.body_sessions
  for select using (auth.uid() = user_id);
create policy "body_sessions_insert_own" on public.body_sessions
  for insert with check (auth.uid() = user_id);
create policy "body_sessions_update_own" on public.body_sessions
  for update using (auth.uid() = user_id);
create policy "body_sessions_delete_own" on public.body_sessions
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- generations (individual generated images)
-- ---------------------------------------------------------------------------
create table if not exists public.generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  character_id uuid references public.characters (id) on delete set null,
  body_session_id uuid references public.body_sessions (id) on delete set null,
  source_image_url text not null,
  generated_image_url text,
  generation_provider text not null default 'mock',
  status text not null default 'queued'
    check (status in ('queued', 'processing', 'completed', 'failed')),
  favorite boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.generations enable row level security;

create policy "generations_select_own" on public.generations
  for select using (auth.uid() = user_id);
create policy "generations_insert_own" on public.generations
  for insert with check (auth.uid() = user_id);
create policy "generations_update_own" on public.generations
  for update using (auth.uid() = user_id);
create policy "generations_delete_own" on public.generations
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- credits
-- ---------------------------------------------------------------------------
create table if not exists public.credits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  balance int not null default 5,
  updated_at timestamptz not null default now(),
  unique (user_id)
);

alter table public.credits enable row level security;

create policy "credits_select_own" on public.credits
  for select using (auth.uid() = user_id);
create policy "credits_update_own" on public.credits
  for update using (auth.uid() = user_id);
create policy "credits_insert_own" on public.credits
  for insert with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- generation_events (audit trail / progress events for a generation)
-- ---------------------------------------------------------------------------
create table if not exists public.generation_events (
  id uuid primary key default gen_random_uuid(),
  generation_id uuid not null references public.generations (id) on delete cascade,
  event_type text not null,
  metadata_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.generation_events enable row level security;

create policy "generation_events_select_own" on public.generation_events
  for select using (
    exists (
      select 1 from public.generations g
      where g.id = generation_events.generation_id and g.user_id = auth.uid()
    )
  );
create policy "generation_events_insert_own" on public.generation_events
  for insert with check (
    exists (
      select 1 from public.generations g
      where g.id = generation_events.generation_id and g.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- Helper: auto-create a profile + starter credit balance on signup
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (user_id, display_name)
  values (new.id, split_part(new.email, '@', 1));

  insert into public.credits (user_id, balance)
  values (new.id, 5);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
create index if not exists idx_characters_user on public.characters (user_id);
create index if not exists idx_character_references_character on public.character_references (character_id, position);
create index if not exists idx_body_sessions_user on public.body_sessions (user_id);
create index if not exists idx_generations_user on public.generations (user_id, created_at desc);
create index if not exists idx_generations_character on public.generations (character_id);
create index if not exists idx_generation_events_generation on public.generation_events (generation_id, created_at);

-- ---------------------------------------------------------------------------
-- Storage
-- ---------------------------------------------------------------------------
-- Create two PRIVATE buckets from the Supabase dashboard (Storage tab), or via:
--   insert into storage.buckets (id, name, public) values ('references', 'references', false);
--   insert into storage.buckets (id, name, public) values ('generations', 'generations', false);
--
-- Then restrict access to each user's own folder (files stored under `${user_id}/...`):
--
-- create policy "references_owner_rw" on storage.objects
--   for all using (bucket_id = 'references' and (storage.foldername(name))[1] = auth.uid()::text)
--   with check (bucket_id = 'references' and (storage.foldername(name))[1] = auth.uid()::text);
--
-- create policy "generations_owner_rw" on storage.objects
--   for all using (bucket_id = 'generations' and (storage.foldername(name))[1] = auth.uid()::text)
--   with check (bucket_id = 'generations' and (storage.foldername(name))[1] = auth.uid()::text);
