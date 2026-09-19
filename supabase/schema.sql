create extension if not exists "pgcrypto";

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  cover_image_url text,
  order_index integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  image_url text not null,
  alt_text text not null default '',
  order_index integer not null default 0,
  grid_span text not null default '1x1' check (grid_span in ('1x1', '1x2', '2x1', '2x2', '3x2')),
  created_at timestamptz not null default now()
);

create table if not exists public.home_content (
  id uuid primary key default gen_random_uuid(),
  hero_title_light text not null default 'DISEÑO MARCAS E IDENTIDADES VISUALES CON',
  hero_title_strong text not null default 'IMPACTO Y DIRECCIÓN',
  hero_subtitle text not null default 'Trabajo junto a marcas y proyectos que buscan verse con claridad, diferenciarse y construir una presencia consistente.',
  updated_at timestamptz not null default now()
);

insert into public.home_content (id)
select '00000000-0000-0000-0000-000000000001'
where not exists (select 1 from public.home_content);

create index if not exists projects_order_idx on public.projects(order_index asc);
create index if not exists project_images_project_order_idx on public.project_images(project_id, order_index asc);

alter table public.projects enable row level security;
alter table public.project_images enable row level security;
alter table public.home_content enable row level security;

create policy "Public can read published projects"
  on public.projects for select
  using (is_published = true);

create policy "Authenticated admins can manage projects"
  on public.projects for all
  to authenticated
  using (true)
  with check (true);

create policy "Public can read project images for published projects"
  on public.project_images for select
  using (exists (select 1 from public.projects where projects.id = project_images.project_id and projects.is_published = true));

create policy "Authenticated admins can manage project images"
  on public.project_images for all
  to authenticated
  using (true)
  with check (true);

create policy "Public can read home content"
  on public.home_content for select
  using (true);

create policy "Authenticated admins can manage home content"
  on public.home_content for all
  to authenticated
  using (true)
  with check (true);

insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

create policy "Public can read project image files"
  on storage.objects for select
  using (bucket_id = 'project-images');

create policy "Authenticated admins can upload project image files"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'project-images');

create policy "Authenticated admins can update project image files"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'project-images')
  with check (bucket_id = 'project-images');

create policy "Authenticated admins can delete project image files"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'project-images');

create table if not exists public.about_content (
  id uuid primary key default gen_random_uuid(),
  title text not null default 'SOBRE MÍ',
  portrait_url text not null default '/images/figma/about-portrait.png',
  portrait_alt text not null default 'Retrato de Nicolas Paris',
  intro text not null default 'Soy Nico París, Licenciado en Diseño y diseñador gráfico especializado en branding e identidad visual.',
  paragraphs text[] not null default array[
    'Trabajo con marcas que buscan construir, renovar o consolidar su identidad, combinando estrategia y diseño para desarrollar sistemas visuales claros, coherentes y con personalidad.',
    'Mi enfoque parte de entender cada proyecto, su contexto y lo que necesita comunicar. A partir de ahí, desarrollo identidades pensadas para funcionar más allá del logo: desde el concepto y la dirección visual hasta las distintas aplicaciones que construyen la marca.',
    'Trabajo de manera independiente con proyectos de diferentes rubros y escalas, buscando que cada solución tenga una lógica propia y responda a necesidades reales de la marca.'
  ],
  updated_at timestamptz not null default now()
);

insert into public.about_content (id)
select '00000000-0000-0000-0000-000000000001'
where not exists (select 1 from public.about_content);

alter table public.about_content enable row level security;

create policy "Public can read about content"
  on public.about_content for select
  using (true);

create policy "Authenticated admins can manage about content"
  on public.about_content for all
  to authenticated
  using (true)
  with check (true);
