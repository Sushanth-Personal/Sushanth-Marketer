-- Run this in your Supabase SQL editor to set up the database

-- Posts table
create table if not exists posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  tag text,
  excerpt text,
  content text,
  cover_image text,
  published boolean default false,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Settings table
create table if not exists settings (
  id uuid default gen_random_uuid() primary key,
  key text unique not null,
  value text not null,
  updated_at timestamp with time zone default timezone('utc', now())
);

-- Default nav settings (blog visible, pricing hidden)
insert into settings (key, value)
values ('nav', '{"blog": true, "pricing": false}')
on conflict (key) do nothing;

-- Enable Row Level Security
alter table posts enable row level security;
alter table settings enable row level security;

-- Allow public read on published posts
create policy "Public can read published posts"
  on posts for select
  using (published = true);

-- Allow all operations from service role (used by admin)
create policy "Service role full access to posts"
  on posts for all
  using (true);

create policy "Service role full access to settings"
  on settings for all
  using (true);
