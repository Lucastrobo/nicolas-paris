# ARCHITECTURE

## Estado

Arquitectura prevista para un proyecto independiente de portfolio y branding. No copiar estructura ni dominio de Kusa Inmobiliaria.

## Stack

- Next.js App Router.
- TypeScript.
- Tailwind CSS.
- Supabase.

## Supabase

Supabase se usara para:
- Auth del panel admin.
- Base de datos de proyectos.
- Base de datos de imagenes y configuracion de grilla.
- Storage para assets de proyectos.
- Textos editables del header/hero de home.

## Email

El formulario publico debe enviar consultas a `nicolasparis.dg@gmail.com` usando Resend. No se guardan consultas en Supabase.

## Modelo tentativo

### projects

- id
- slug
- title
- description
- cover_image_url
- order_index
- is_published
- created_at
- updated_at

### project_images

- id
- project_id
- image_url
- alt_text
- order_index
- grid_span: `1x1`, `1x2`, `2x1`, `2x2`
- created_at

### home_content

- id
- hero_title
- hero_subtitle
- updated_at


## Rutas previstas

- `/`
- `/sobre-mi`
- `/proyectos/[slug]`
- `/admin/login`
- `/admin`
- `/admin/proyectos`
- `/admin/proyectos/nuevo`
- `/admin/proyectos/[id]`
- `/admin/home`

## Reglas

- Priorizar fidelidad al Figma.
- Componentizar header, footer, grillas, formulario y tarjetas de proyecto.
- La grilla de imagenes debe ser data-driven mediante `grid_span` y `order_index`.
- No agregar categorias de proyecto hasta que se pidan.

