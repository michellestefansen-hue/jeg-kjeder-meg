-- Kjør dette i Supabase SQL Editor

create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  username text unique not null,
  age int not null check (age >= 10 and age <= 17),
  area text not null default 'Oslo',
  vipps_number text,
  photo_url text,
  friends uuid[] default '{}',
  friend_requests uuid[] default '{}',
  sent_requests uuid[] default '{}',
  banner_color text default '#ec4899',
  bg_color text default '#ffffff',
  created_at timestamptz default now()
);

-- Alle kan lese profiler, kun eier kan endre sin egen
alter table public.profiles enable row level security;

create policy "Alle kan lese profiler"
  on public.profiles for select using (true);

create policy "Bruker kan oppdatere egen profil"
  on public.profiles for update using (auth.uid() = id);

create policy "Bruker kan opprette profil"
  on public.profiles for insert with check (auth.uid() = id);
