# IMPLEMENTATION PLAN

## Fase 0: Prompt y documentacion

- Corregir documentacion para Nicolas Paris como diseñador grafico y especialista en branding.
- Consolidar prompt maestro.
- Validar dudas funcionales antes de escribir codigo.

## Fase 1: Base del proyecto

- Crear app Next.js con TypeScript y Tailwind.
- Configurar estructura de carpetas.
- Configurar fuentes y tokens visuales del Figma.
- Exportar assets necesarios del Figma.

## Fase 2: Sitio publico estatico fiel al Figma

- Implementar home.
- Implementar sobre mi.
- Implementar detalle de proyecto.
- Implementar responsive.
- Verificar visualmente contra Figma.

## Fase 3: Supabase y admin

- Configurar Supabase Auth.
- Crear tablas de proyectos, imagenes y home content.
- Crear storage de imagenes.
- Implementar admin en `/admin`.
- Implementar CRUD de proyectos y gestion de spans de grilla.

## Fase 4: Contacto por email

- Definir proveedor de email.
- Implementar API route de contacto.
- Enviar email al receptor definido.
- Opcional: guardar copia en Supabase.

## Fase 5: QA y deploy

- Validar desktop y mobile contra Figma.
- Revisar accesibilidad basica.
- Revisar SEO.
- Build de produccion.
- Deploy.
