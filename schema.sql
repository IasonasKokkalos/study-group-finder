-- =============================================
-- Study Group Finder — Database Schema
-- =============================================
-- Run this in your Supabase SQL Editor to set up
-- all tables, policies, triggers, and real-time.
-- =============================================

-- Create the profiles table (public-facing user data)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  display_name text,
  created_at timestamptz default now()
);

-- Create the sessions table
create table public.sessions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  title text not null,
  description text default '',
  location text not null,
  session_date timestamptz not null,
  creator_id uuid references public.profiles(id) on delete cascade not null
);

-- Create the join table for participants
create table public.session_participants (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references public.sessions(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  joined_at timestamptz default now(),
  unique(session_id, user_id)  -- prevents joining the same session twice
);

-- Enable Row Level Security on all tables
alter table public.profiles enable row level security;
alter table public.sessions enable row level security;
alter table public.session_participants enable row level security;

-- Profiles: anyone can read, users can update their own
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Sessions: anyone logged in can read, creators can insert/delete
create policy "Sessions are viewable by authenticated users"
  on public.sessions for select
  to authenticated
  using (true);

create policy "Authenticated users can create sessions"
  on public.sessions for insert
  to authenticated
  with check (auth.uid() = creator_id);

create policy "Creators can delete their own sessions"
  on public.sessions for delete
  to authenticated
  using (auth.uid() = creator_id);

-- Participants: anyone logged in can read, users manage their own
create policy "Participants are viewable by authenticated users"
  on public.session_participants for select
  to authenticated
  using (true);

create policy "Authenticated users can join sessions"
  on public.session_participants for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can leave sessions"
  on public.session_participants for delete
  to authenticated
  using (auth.uid() = user_id);

-- Auto-create a profile when a user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Enable realtime for sessions and participants
alter publication supabase_realtime add table public.sessions;
alter publication supabase_realtime add table public.session_participants;
