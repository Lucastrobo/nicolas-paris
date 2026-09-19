# REQUIREMENTS

## Requisitos visuales

- La implementacion debe ser fiel al Figma.
- Respetar layout, grillas, espaciados, tamaños tipograficos, colores, logos, imagenes y jerarquia.
- Mantener una estetica editorial, minimalista, tipografica y en blanco/negro.
- Evitar apariencia de template generico, SaaS, inmobiliaria o landing page convencional.
- Corregir el texto del footer de `Linkeding` a `LinkedIn`.

## Requisitos publicos

- Home con hero, proyectos, metodo de trabajo, contacto y footer.
- Pagina Sobre mi con biografia y foto segun Figma.
- Pagina de detalle de proyecto con descripcion y grilla/mosaico de imagenes.
- Navegacion: Proyectos, Como trabajo, Sobre mi, Contacto.
- Formulario de contacto con campos Nombre, Email y Contame sobre tu proyecto.
- El formulario debe enviar la consulta por email a `nicolasparis.dg@gmail.com`. No guardar consultas en Supabase.

## Requisitos de proyectos

- Cada proyecto debe tener titulo, descripcion, imagenes, orden y estado publicado/no publicado.
- No se necesitan categorias en fase inicial.
- El orden es importante: define donde aparece cada proyecto en home, listados y relacionados.
- Las imagenes de detalle deben soportar distintos spans de grilla:
  - 1 celda normal.
  - 2 celdas verticales.
  - 2 celdas horizontales.
  - 4 celdas.
- La grilla debe construirse con datos administrables, no con posiciones hardcodeadas por proyecto.

## Requisitos de admin

- Admin en `/admin`.
- Login real con Supabase Auth por email/password.
- CRUD de proyectos.
- Carga de imagenes en Supabase Storage.
- Edicion de titulo, descripcion, orden, estado publicado y layout/span de cada imagen.
- Edicion de textos principales del header/hero de la home.
- No crear seccion de administracion para contacto.

## Requisitos de animacion e interaccion

- El texto de fondo del header DISEÑO * CRITERIO * MÉTODO * IMPACTO debe funcionar como marquee infinito.
- El vector/asterisco del header y el de Cómo trabajo deben girar en sentido horario.
- Las tarjetas de proyectos deben tener hover con zoom sutil de imagen sin cambiar el tamaño del componente.
- La imagen de fondo de Cómo trabajo debe tener parallax con scroll.
- Las imagenes deben tener skeletons durante carga.
- En mobile, la grilla de proyectos de home puede convertirse en carousel.

## Requisitos tecnicos

- Next.js App Router.
- TypeScript.
- Tailwind CSS.
- Supabase para auth, base de datos y storage.
- Resend para enviar consultas del formulario.
- SEO basico para home, sobre mi y detalles de proyecto.
- Responsive fiel al Figma.

## Pendientes

- Definir servicio de email: Resend, SendGrid, SMTP u otro.
- Exportar assets definitivos del Figma.

