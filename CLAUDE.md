# La Casa de los Vientos

Sitio web de una hostería en San Carlos, Valle Calchaquí, Salta, Argentina.

## Stack
React + Vite + TypeScript + Tailwind CSS (v4, plugin `@tailwindcss/vite`). Tests con vitest.

## Comandos
- `npm run dev` — servidor de desarrollo (http://localhost:5173)
- `npm run build` — chequeo de tipos (`tsc`) + build de producción
- `npm run lint` — linter
- `npm test` — tests (vitest)

## Convenciones
- Idioma del sitio: español rioplatense con voseo (el mockup usa "usted"; se unificó a voseo). Idiomas previstos: es, en, fr, pt-BR.
- Componentes funcionales en `src/components`, un componente por archivo `.tsx`.
- Estilos con clases de Tailwind; evitar CSS aparte salvo necesidad.
- Para estilo y marca, usar las skills `frontend-design` y `marca-hosteria`.
- Tokens de diseño en `src/index.css` (`@theme`): `primary`, `secondary`, `tertiary`, `canvas`, `sand`, `mortar`, `ink`, `font-display`, `font-sans`.
- **No inventar contenido**: ni servicios, ni precios, ni puntuaciones, ni premios, ni horarios. Lo que falta va como placeholder con `TODO` (visible en la página); lo heredado del mockup sin confirmar lleva `TODO(confirmar)` en un comentario. `grep -rn TODO src` lista los pendientes.
- Los datos del negocio viven solo en `src/data/siteConfig.ts`; nada hardcodeado en los componentes.
- Nunca usar la palabra «boutique»: si hace falta un descriptor, «Hostería» a secas.

## Decisiones
- TypeScript (no JavaScript).
- Git local, sin push. Se trabaja en la rama `feat/landing-v2` (commit base `d7695b3` en `main`) con un commit por etapa. `PLAN.md` todavía es el plan viejo: se reemplaza al cerrar la etapa 6.
- Nombre del sitio: **La Casa de los Vientos** (el mockup desktop dice "El Gallo de Viento"; reemplazar siempre).
- **El backend (API, panel de admin, disponibilidad, captcha) lo hace el usuario aparte, después.** Acá solo se dejan los objetos que va a necesitar: `src/api/contract.ts` (tipos) y los documentos de `src/data/`. No agregar Express, MongoDB ni nada de servidor.

## Diseño
- Referencia en `contexto/`: `DESIGN_desktop.md` (sistema "Calchaquí Luxury Heritage"), `code_*.html` y `mockup-*.jpeg`. No es código de producción.
- Secciones, en este orden: hero (con barra de consulta y 2 highlights), Conocenos, Habitaciones (7), Instalaciones (4), Contacto; footer. Navbar: logo (→ `#inicio`) y 4 enlaces, sin botón de acción.
- Sin precios, sin calendario de disponibilidad, sin reseñas inventadas.
- Fotos: el componente `Photo` muestra un placeholder con la proporción exacta hasta que existan las reales (ids en `src/data/*`, p. ej. `rooms/01-sonqoy/01`).
- Logo: si existe `src/assets/logo.(svg|png|webp|jpg)` se usa solo; si no, se muestra el nombre en texto.

## Estructura de `src/`
- `App.tsx`: arma la página.
- `components/`: una sección por archivo (`Header`, `Hero` + `BookingBar`, `About`, `Rooms`, `Facilities`, `Contact`, `Footer`) más `Photo`, `Icon`, `Logo`, `SectionHeading`.
- `api/contract.ts`: **solo tipos y constantes** del contrato con el backend futuro.
- `data/`: `siteConfig.ts` (datos del negocio), `rooms.ts`, `facilities.ts`, `platforms.ts` (documentos, módulos puros importables desde Node), `nav.ts`, `photoIds.ts`. Tests en `data.test.ts`.
- `lib/`: `dates.ts`, `whatsapp.ts`, `beds.ts` (descripción de camas; provisorio en español).
- `assets/img/hero.svg`: único SVG que queda (placeholder del hero).

## Notas técnicas
- Sin backend: el formulario del hero abrirá WhatsApp (`wa.me`) con el mensaje armado; el de contacto irá a un endpoint configurable.
- Fechas del contrato como texto `YYYY-MM-DD`, nunca `Date` (`new Date('2026-12-15')` es medianoche UTC y en Argentina da el 14).
- Íconos: Material Symbols (Google Fonts, ver `index.html`) vía `<Icon name="..." />`.
- No usar `overline` como nombre de clase propia: choca con la utilidad de Tailwind. La del sistema se llama `kicker`.
- Firefox no baja de ~500 px de ventana: para verificar 360/390 px se carga la página en un iframe del ancho exacto.
