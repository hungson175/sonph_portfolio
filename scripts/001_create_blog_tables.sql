-- Create blogs table with RLS
create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  cover_image text,
  published boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  author_id uuid references auth.users(id) on delete cascade
);

-- Enable RLS
alter table public.blogs enable row level security;

-- Public can read published blogs
create policy "Anyone can view published blogs"
  on public.blogs for select
  using (published = true);

-- Authenticated users can view all their own blogs
create policy "Users can view their own blogs"
  on public.blogs for select
  using (auth.uid() = author_id);

-- Authenticated users can create blogs
create policy "Users can create blogs"
  on public.blogs for insert
  with check (auth.uid() = author_id);

-- Users can update their own blogs
create policy "Users can update their own blogs"
  on public.blogs for update
  using (auth.uid() = author_id);

-- Users can delete their own blogs
create policy "Users can delete their own blogs"
  on public.blogs for delete
  using (auth.uid() = author_id);

-- Create index for better query performance
create index if not exists blogs_slug_idx on public.blogs(slug);
create index if not exists blogs_published_idx on public.blogs(published);
create index if not exists blogs_author_id_idx on public.blogs(author_id);

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger blogs_updated_at
  before update on public.blogs
  for each row
  execute function public.handle_updated_at();
