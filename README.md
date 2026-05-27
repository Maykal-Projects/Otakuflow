# Anime Tracker

## Install
npm install

## Run
npm run dev

## Create .env.local
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_KEY

## SQL
create table user_anime (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null,
  anime_id int not null,
  status text not null,
  progress int default 0,
  score int,
  notes text,
  updated_at timestamp default now()
);
