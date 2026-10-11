# Plan: guardar el contexto de diseño en el proyecto (sin construir la página todavía)

## Context
El proyecto base (Vite + React + TS + Tailwind v4, git local, `CLAUDE.md`, skill `marca-hosteria` con placeholders) ya está creado. El usuario aportó los mockups generados con una herramienta de diseño: 2 capturas (desktop y mobile), `DESIGN_desktop.md`, `DESIGN_mobile.md` (idénticos: sistema "Calchaquí Luxury Heritage") y `code_desktop.html` / `code_mobile.html` (referencia en HTML + Tailwind CDN). Antes de pedir la página, hay que dejar ese contexto guardado en el repo para que persista entre sesiones.

Decisiones del usuario:
- El nombre en el sitio es **Casa de los Vientos** (el mockup dice "El Gallo de Viento": se reemplaza en toda la copy).
- Datos del mockup (teléfonos, mail, precios USD, reseñas, 4.98 Superhost, Ruta 40, coordenadas) se dejan como **placeholder**, concentrados en un solo archivo de datos para reemplazarlos después.
- Fotos: **placeholders** locales ahora, fotos reales después.

Contenido del mockup (para el futuro pedido de la página): header fijo con nav (La Hostería, Instalaciones, Habitaciones & Reservas, Experiencia Salta, Airbnb & Reseñas, Contacto) + selector ES/EN/PT; hero con barra de disponibilidad; tira de highlights; historia + stats; galería filtrable de instalaciones; 3 habitaciones con calendario y modal de consulta por WhatsApp; reseñas Airbnb; ubicación + FAQ + formulario de solicitud; footer.

## Pasos
1. **Guardar los archivos fuente** en `contexto/` (versionados): copiar `DESIGN_desktop.md`, `DESIGN_mobile.md`, `code_desktop.html`, `code_mobile.html` y las dos capturas (renombradas `mockup-desktop.jpeg`, `mockup-mobile.jpeg`). Nota en `contexto/README.md`: son referencia, no código de producción.
2. **Completar la skill `marca-hosteria`** (`.claude/skills/marca-hosteria/SKILL.md`): paleta (vino `#7B1E2B`/`#58111A`, terracota `#C86D51`, verde cardón `#5C6B50`, base `#FAF7F2`, `#F4EBE1`, `#ECE2D4`, carbón `#2B2625`), tipografías (Playfair Display títulos, Plus Jakarta Sans texto), escala tipográfica, radios, espaciado, layout (máx. 1360px, 12/8/4 columnas), elevación, componentes clave y tono (español rioplatense, voseo, cálido). Remitir a `contexto/DESIGN_desktop.md` para el detalle completo. Aclarar que el nombre es Casa de los Vientos y que la dirección visual sigue el mockup.
3. **Tokens en el proyecto**: en `src/index.css` definir `@theme` de Tailwind v4 con los colores/tipografías/espaciados del DESIGN (nombres como `primary`, `surface`, `font-display`), e importar Playfair Display y Plus Jakarta Sans (Google Fonts en `index.html`). Sin componentes todavía; `App.tsx` queda mínimo.
4. **CLAUDE.md**: agregar sección "Diseño": referencia a `contexto/`, nombre del sitio, secciones de la página, regla de que los datos de contacto/precios/reseñas son placeholder y viven en un único `src/data/`, y que las fotos van en `src/assets/img/` con placeholders. Quitar el "Pendiente" de estilo visual y secciones.
5. **PLAN.md del proyecto**: reemplazar por este plan (o agregar una sección "Contexto de diseño").

## Verificación
- `npm run build` pasa sin errores.
- `npm run dev`: el título "Casa de los Vientos" se ve con Playfair Display y el fondo `#FAF7F2`.
- `/skills` lista `marca-hosteria` con la paleta cargada; `contexto/` tiene los 6 archivos.
- `git status`: sin commits (los hace el usuario).

## Fuera de alcance (se hará cuando el usuario pida la página)
Construir las secciones, el calendario, el modal de WhatsApp, el formulario, el selector de idioma, y reemplazar placeholders por datos y fotos reales.
