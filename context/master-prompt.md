# MASTER PROMPT: NICOLAS PARIS WEB

Construir una web portfolio y comercial para Nicolas Paris, diseñador gráfico especializado en branding, creación de marcas e identidad visual.

La web debe replicar fielmente el diseño del Figma:
https://www.figma.com/design/ryixRWLxVtp1k7QQXehnrZ/Nicolas-Paris-web--Copy-

## Objetivo

El sitio debe funcionar como portfolio personal y sitio comercial. Debe mostrar proyectos de branding, explicar el método de trabajo de Nicolas, presentar su perfil profesional y facilitar consultas de potenciales clientes.

## Idioma

Español únicamente.

## Stack obligatorio

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase
- Resend para envío de emails desde el formulario de contacto

## Dirección visual

- Implementar el diseño 1:1 respecto al Figma.
- Respetar composición, espaciados, grillas, tamaños tipográficos, colores, logos, imágenes y jerarquía visual.
- Mantener estética editorial, minimalista, tipográfica, blanco/negro y autoral.
- No usar estética de template genérico, SaaS, inmobiliaria ni landing page estándar.
- Corregir `Linkeding` a `LinkedIn`.

## Pantallas públicas

- Home / portfolio.
- Sobre mí.
- Detalle de proyecto.
- Contacto integrado en las páginas según Figma.
- Responsive desktop, tablet y mobile según Figma.

## Contenido inicial

Usar los textos visibles en Figma como contenido base:

- DISEÑO MARCAS E IDENTIDADES VISUALES CON IMPACTO Y DIRECCIÓN
- Trabajo junto a marcas y proyectos que buscan verse con claridad, diferenciarse y construir una presencia consistente.
- Proyectos con impacto
- Una mirada, tres etapas.
- Entender
- Definir
- Activar
- ¿Tenés un proyecto en mente?
- Contame un poco sobre tu proyecto y coordinamos una primera charla.
- nicolasparis.dg@gmail.com

## Animaciones e interacción

- El texto de fondo del header `DISEÑO * CRITERIO * MÉTODO * IMPACTO` debe animarse como loop infinito horizontal, tipo marquee continuo.
- El vector/asterisco del header debe girar en sentido horario de forma continua.
- El vector/asterisco de la sección `Cómo trabajo` también debe girar en sentido horario de forma continua.
- En los proyectos de la home, el hover debe aplicar un zoom sutil a la imagen sin agrandar el tamaño del componente ni mover la grilla. Usar `overflow: hidden` en el contenedor.
- En la sección `Cómo trabajo`, la imagen de fondo debe tener efecto parallax con scroll. En Figma la imagen es más grande que el viewport de la sección; aprovechar ese margen para generar el movimiento.
- Las animaciones deben ser sobrias, fluidas y coherentes con una web de portfolio profesional. No agregar efectos decorativos no presentes en el diseño.

## Carga y estados

- Implementar skeletons para la carga de imágenes de proyectos y galerías.
- Los skeletons deben respetar la misma geometría del layout final para evitar saltos visuales.
- Mantener los tamaños de tarjetas y celdas estables durante carga, hover y transición.

## Responsive

- Adaptar todo a desktop, tablet y mobile.
- Usar los bocetos mobile/tablet disponibles en Figma como referencia.
- En mobile, los proyectos de la home pueden convertirse en carousel horizontal.
- El carousel debe mantener el espíritu del Figma: limpio, visual, sin controles pesados.
- Evitar textos cortados, solapamientos o cambios bruscos de jerarquía.

## Proyectos

Cada proyecto debe tener:

- Título.
- Slug.
- Descripción.
- Imagen de portada.
- Imágenes de detalle.
- Orden de aparición.
- Estado publicado/no publicado.

No implementar categorías por ahora.

El orden es clave porque define en qué lugares aparece cada proyecto.

## Grilla de imágenes de proyecto

La grilla de detalle debe soportar imágenes con distintos tamaños dentro del mosaico:

- `1x1`: ocupa una celda normal.
- `1x2`: ocupa dos celdas verticales.
- `2x1`: ocupa dos celdas horizontales.
- `2x2`: ocupa cuatro celdas.

Esta estructura debe ser administrable desde el panel. No hardcodear el layout de cada proyecto en componentes estáticos.

## Admin

Crear panel privado en `/admin` con login real por Supabase Auth email/password.

El admin debe permitir:

- Crear, editar y eliminar proyectos.
- Subir imágenes a Supabase Storage.
- Editar título, slug, descripción, portada, orden y estado de publicación.
- Ordenar imágenes de detalle.
- Elegir el span de grilla de cada imagen: `1x1`, `1x2`, `2x1`, `2x2`.
- Editar textos principales del header/hero de la home.

No crear una sección de contacto en el administrador.

## Contacto

El formulario público debe tener:

- Nombre.
- Email.
- Contame sobre tu proyecto.

Al enviarse, la consulta debe llegar por email a:

- `nicolasparis.dg@gmail.com`

Usar Resend salvo que aparezca una limitación técnica concreta. No guardar consultas en Supabase.

## Supabase

Usar Supabase para:

- Auth del admin.
- Base de datos de proyectos.
- Base de datos de imágenes y configuración de grilla.
- Storage de imágenes.
- Textos editables del header/hero de la home.

No usar Supabase para guardar consultas del formulario.

## Criterios de calidad

- Web fiel al Figma en desktop, tablet y mobile.
- Nada de contenido inmobiliario.
- Nada basado en Kusa Inmobiliaria.
- Código limpio, componentizado y mantenible.
- La web debe poder cargarse con contenido real luego.
- El admin debe ser simple, claro y eficiente.
- Verificar visualmente contra capturas del Figma antes de cerrar la implementación.
