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

drop policy if exists "Public can read about content" on public.about_content;
create policy "Public can read about content"
  on public.about_content for select
  using (true);

drop policy if exists "Authenticated admins can manage about content" on public.about_content;
create policy "Authenticated admins can manage about content"
  on public.about_content for all
  to authenticated
  using (true)
  with check (true);
