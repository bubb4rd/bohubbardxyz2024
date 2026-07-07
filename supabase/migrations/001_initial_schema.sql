-- Portfolio CMS schema

create table if not exists site_settings (
  id text primary key default 'main',
  hero_line_1 text not null default 'Intentional',
  hero_line_2 text not null default 'Design.',
  name text not null default 'Bo Hubbard',
  credential text not null default 'B.S. Computer Science · Class of 2026',
  subtext text not null default 'Software development, graphic design, and interfaces built with purpose.',
  hero_roles jsonb not null default '[]'::jsonb,
  about_heading text not null default 'Bo Hubbard',
  about_subheading text not null default 'developer & designer',
  about_paragraphs jsonb not null default '[]'::jsonb,
  about_image_url text not null default '/images/bo-hubbard-graduation.png',
  about_image_alt text not null default 'Bo Hubbard at ASU graduation in maroon and gold regalia',
  location text not null default 'Chicago, IL',
  timezone text not null default 'America/Chicago',
  meta_title text not null default 'Bo Hubbard — Developer & Designer',
  meta_description text not null default 'Portfolio of William (Bo) Hubbard — software developer, graphic designer, and ASU Computer Science graduate.',
  og_url text not null default 'https://bohubbard.xyz',
  resume_url text not null default '/cv.pdf',
  resume_label text not null default 'Resume',
  updated_at timestamptz not null default now()
);

create table if not exists projects (
  id text primary key,
  title text not null,
  subtitle text not null,
  description text not null,
  tags jsonb not null default '[]'::jsonb,
  href text,
  github text,
  category text not null check (category in ('dev', 'design')),
  accent text not null,
  image_url text,
  featured boolean not null default false,
  spotlight boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists timeline_entries (
  id text primary key,
  type text not null check (type in ('work', 'education')),
  title text not null,
  organization text not null,
  location text,
  start_date text not null,
  end_date text not null,
  description text not null,
  accent text not null,
  image_url text not null,
  image_alt text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists skill_categories (
  id text primary key,
  title text not null,
  accent text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists skills (
  id uuid primary key default gen_random_uuid(),
  category_id text not null references skill_categories(id) on delete cascade,
  name text not null,
  icon text not null,
  accent text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists social_links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  href text not null,
  icon text not null check (icon in ('github', 'linkedin', 'email', 'behance')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS
alter table site_settings enable row level security;
alter table projects enable row level security;
alter table timeline_entries enable row level security;
alter table skill_categories enable row level security;
alter table skills enable row level security;
alter table social_links enable row level security;

-- Public read
create policy "Public read site_settings" on site_settings for select using (true);
create policy "Public read projects" on projects for select using (true);
create policy "Public read timeline_entries" on timeline_entries for select using (true);
create policy "Public read skill_categories" on skill_categories for select using (true);
create policy "Public read skills" on skills for select using (true);
create policy "Public read social_links" on social_links for select using (true);

-- Authenticated write (single admin user)
create policy "Admin write site_settings" on site_settings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin write projects" on projects for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin write timeline_entries" on timeline_entries for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin write skill_categories" on skill_categories for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin write skills" on skills for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin write social_links" on social_links for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Storage bucket (run in Supabase dashboard or via API)
insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do nothing;

create policy "Public read portfolio assets"
on storage.objects for select
using (bucket_id = 'portfolio-assets');

create policy "Admin upload portfolio assets"
on storage.objects for insert
with check (bucket_id = 'portfolio-assets' and auth.role() = 'authenticated');

create policy "Admin update portfolio assets"
on storage.objects for update
using (bucket_id = 'portfolio-assets' and auth.role() = 'authenticated');

create policy "Admin delete portfolio assets"
on storage.objects for delete
using (bucket_id = 'portfolio-assets' and auth.role() = 'authenticated');
