# La Casa de los Vientos

Sitio web de una hostería en Salta, Argentina.

## Stack
React + Vite + TypeScript + Tailwind CSS (v4, plugin `@tailwindcss/vite`).

## Comandos
- `npm run dev` — servidor de desarrollo (http://localhost:5173)
- `npm run build` — chequeo de tipos (`tsc`) + build de producción
- `npm run lint` — linter

## Convenciones
- Idioma del sitio: español rioplatense con voseo (el mockup usa "usted"; se unificó a voseo). Inglés/portugués pendientes.
- Componentes funcionales en `src/components`, un componente por archivo `.tsx`.
- Estilos con clases de Tailwind; evitar CSS aparte salvo necesidad.
- Para estilo y marca, usar las skills `frontend-design` y `marca-hosteria`.
- Tokens de diseño en `src/index.css` (`@theme`): `primary`, `secondary`, `tertiary`, `canvas`, `sand`, `mortar`, `ink`, `font-display`, `font-sans`.

## Decisiones
- TypeScript (no JavaScript).
- Git solo local: el usuario hace los commits y sube al remoto; no commitear ni hacer push sin que lo pida.
- Nombre del sitio: **La Casa de los Vientos** (el mockup desktop dice "El Gallo de Viento"; reemplazar siempre).

## Diseño
- Referencia en `contexto/`: `DESIGN_desktop.md` (sistema "Calchaquí Luxury Heritage"), `code_*.html` y `mockup-*.jpeg`. No es código de producción.
- Secciones del mockup: header fijo con nav (La Hostería, Instalaciones, Habitaciones & Reservas, Experiencia Salta, Airbnb & Reseñas, Contacto) y selector ES/EN/PT; hero con barra de disponibilidad; tira de highlights; historia + stats; galería filtrable de instalaciones; 3 habitaciones con calendario y modal de consulta por WhatsApp; reseñas Airbnb; ubicación + FAQ + formulario; footer.
- Teléfonos, mail, precios, reseñas, calificación y dirección del mockup son **placeholder**: viven en `src/data/` y se reemplazan después.
- Fotos placeholder en `src/assets/img/`; se cambian por fotos reales más adelante.
- Pendiente: idiomas definitivos (ES/EN/PT) y si la reserva es solo WhatsApp o también formulario.

## Estructura de `src/`
- `App.tsx`: arma la página y guarda el estado compartido de la estadía (`Stay`: fechas, huéspedes, habitación) y el pedido del modal.
- `components/`: una sección por archivo (`Header`, `Hero` + `BookingBar`, `About`, `Facilities`, `Rooms` + `AvailabilityCalendar`, `Reviews`, `Contact`, `Footer`) más `BookingModal` (usa `<dialog>`), `Icon`, `Logo`, `SectionHeading`.
- `data/site.ts`: **todo el contenido placeholder** (contacto, precios, habitaciones, reseñas, FAQs) y `isOccupied()` (disponibilidad de ejemplo, determinística).
- `lib/`: `dates.ts`, `stay.ts`, `whatsapp.ts`.
- `assets/img/*.svg`: fotos placeholder (paisajes generados). Reemplazarlas por fotos reales conservando el nombre, o actualizar los imports en `data/site.ts`.

## Notas técnicas
- Las reservas no tienen backend: el modal y el formulario abren WhatsApp (`wa.me`) con el mensaje armado.
- Selector de idioma ES/EN/PT: solo ES está activo.
- Íconos: Material Symbols (Google Fonts, ver `index.html`) vía `<Icon name="..." />`.
- No usar `overline` como nombre de clase propia: choca con la utilidad de Tailwind. La del sistema se llama `kicker`.
- Con Tailwind v4 el preflight pone `margin: 0` a todo: el `<dialog>` necesita `m-auto` para centrarse.
