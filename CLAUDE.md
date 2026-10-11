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
- Idiomas: es (fuente de verdad, español rioplatense con voseo), en, fr y pt-BR. **fr y pt-BR son un primer borrador** que debe revisar una persona (ver la cabecera de cada archivo).
- **Todo texto visible** (contenido, `alt`, `aria-label`, `<title>`, meta description, mensajes de WhatsApp) sale de `src/i18n/`; no se escribe en los componentes. Para sumar uno: primero la clave en `es.ts` y después en los otros tres (si falta una, `tsc` rompe; un test avisa si queda un texto igual al español).
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
- Fotos: **las sirve el backend** (lo hace el usuario después); el frontend no genera tamaños (sin `sharp` ni script de imágenes). Llegan como datos `PhotoData` (`src/api/contract.ts`: id, tamaño real y archivos AVIF/WebP/JPEG por ancho) por **un único punto**, `loadPhotos` en `src/api/photos.ts` (hoy devuelve `[]`, con un `TODO` donde va el `fetch`); el `PhotosProvider` las guarda en estado de React. Mientras no estén, `Photo` muestra un placeholder con la proporción exacta. Los ids están en `src/data/*` (p. ej. `rooms/01-sonqoy/01`; la hero es `hero`, Conocenos `about/01`).
- Logo: si existe `src/assets/logo.(svg|png|webp|jpg)` se usa solo; si no, se muestra el nombre en texto.

## Estructura de `src/`
- `App.tsx`: arma la página.
- `components/`: una sección por archivo (`Header`, `Hero` + `BookingBar`, `About`, `Rooms`, `Facilities`, `Contact`, `Footer`) más `LanguageSelect`, `Photo` (+ `PhotoPlaceholder`: pulsa mientras `status` es `loading`; la foto aparece con un fundido al terminar de bajar), `PhotoGallery` (carrusel `scroll-snap`; pide cada foto recién cuando se acerca), `Icon`, `Logo`, `SectionHeading`, `WhatsAppIcon` (SVG inline), `ContactForm` (formulario → backend) y `PlatformCards` (Airbnb/Booking).
- `i18n/`: `es.ts` (claves y textos, fuente de verdad), `en.ts`, `fr.ts`, `pt-BR.ts`; `translations.ts` (ensambla y exporta `LANGS`), `translate.ts` (`makeT`: reemplaza `{variables}`), `format.ts` (camas, capacidad y fecha larga con `Intl`), `detect.ts` (idioma inicial), `I18nProvider.tsx` + `useI18n.ts` (`const { t, lang, setLang, describeBeds, describeCapacity, formatDate } = useI18n()`).
- `photos/`: `context.ts` (`Photos` = `{ status, getPhoto }`, `PhotosStatus`), `PhotosProvider.tsx` (estado `{ status, photos }` + `useEffect` con `AbortController`), `usePhotos.ts`. Mismo patrón que `i18n/`.
- `api/contract.ts`: **solo tipos y constantes** del contrato con el backend futuro. `api/photos.ts`: `loadPhotos(signal)`, el único lugar donde se piden las fotos.
- `data/`: `siteConfig.ts` (datos del negocio), `rooms.ts`, `facilities.ts`, `platforms.ts` (documentos, módulos puros importables desde Node), `nav.ts`, `photoIds.ts`. Tests en `data.test.ts`.
- `lib/`: `dates.ts` (fechas locales y `YYYY-MM-DD`), `photo.ts` (`srcset`, archivo de respaldo, `indexPhotos`), `validation.ts` (`validateBooking`: funciones puras que devuelven códigos de error, no textos), `whatsapp.ts` (`whatsappLink`, `bookingMessage`), `contactClient.ts` (`POST` JSON al backend y lectura de `ContactResponse`).
- `assets/img/hero.svg`: único SVG que queda (placeholder del hero).

## Notas técnicas
- Idioma inicial: el elegido antes (`localStorage`, clave `lang`) → idioma del navegador si es uno de los cuatro (`pt-PT` cae en `pt-BR`) → español. Cambiarlo actualiza `<html lang>`, `<title>` y la meta description. Con una sola URL los buscadores indexan una sola versión: el SEO por idioma exigiría una URL por idioma con prerenderizado.
- Textos con negrita o enlaces dentro: se parten en claves (`about.p1.before` / `after`), no se guarda HTML en los diccionarios.
- Sin backend: el formulario del hero (`BookingBar`) es una **consulta**: valida (`noValidate` + `lib/validation.ts`; los atributos HTML quedan para teclado y límites del selector), arma el mensaje en el idioma activo (plantillas `whatsapp.booking.*`, fechas con el mes en letras) y abre WhatsApp (`wa.me`) con `window.open(url, '_blank', 'noopener,noreferrer')`. Con `noopener` devuelve siempre `null` (no se puede saber si lo bloquearon), así que siempre se muestra el enlace de respaldo. El de contacto (`ContactForm`) hace `POST` JSON de un `ContactRequest` a `VITE_CONTACT_ENDPOINT` (tu propio backend, sin servicios de terceros) y solo confía en un `ContactResponse` (`src/api/contract.ts`); cualquier otra respuesta o un corte de red cuenta como `unavailable`, nunca como enviado. **Una sola variable de entorno** (ver `.env.example` y el contrato del backend en `README.md`): Vite la escribe en el JS al compilar, así que cambiarla exige volver a compilar y desplegar. Sin ella el formulario **no se muestra en producción**; en desarrollo se ve con el botón deshabilitado, una etiqueta con el nombre de la variable y un `console.warn` (una vez). Honeypot `website`: si viene lleno no se envía nada y se muestra el mismo «éxito».
- Las tarjetas de Airbnb/Booking (`PlatformCards`) solo aparecen en producción si `src/data/platforms.ts` tiene la `url`; en desarrollo se ven las que faltan, marcadas con `TODO`.
- Para probar el formulario sin tu backend: un servidor local que cumpla el contrato (con CORS: el `Content-Type: application/json` dispara un `OPTIONS` previo) y un build con `VITE_CONTACT_ENDPOINT=http://localhost:PUERTO/api/contact`. Ojo: los navegadores bloquean algunos puertos (p. ej. 4190).
- **La disponibilidad se maneja a mano por WhatsApp (los dueños).** La página no la muestra, no la calcula ni promete confirmaciones ni plazos: ningún texto puede insinuarlo (por eso «Sin preferencia» y no «Cualquiera disponible»). «Quisiera consultar disponibilidad» en el mensaje está bien: es una pregunta al dueño.
- Fechas del contrato como texto `YYYY-MM-DD`, nunca `Date` (`new Date('2026-12-15')` es medianoche UTC y en Argentina da el 14).
- Íconos: Material Symbols (Google Fonts, ver `index.html`) vía `<Icon name="..." />`.
- No usar `overline` como nombre de clase propia: choca con la utilidad de Tailwind. La del sistema se llama `kicker`.
- `Photo` no define su propia posición: la hero le pasa `absolute inset-0`. Si el contenedor tuviera `relative` propio, chocaría con esa clase y la foto dejaría de cubrir el hero (pasó y se corrigió).
- `loading="lazy"` no alcanza en un carrusel horizontal: las slides vecinas quedan cerca del viewport. `PhotoGallery` pide la foto 1 con carga diferida y las demás con un `IntersectionObserver` (cuando asoman al deslizar) o al acercar el puntero/foco.
- Fotos: un objeto común modificado por fuera NO hace que React vuelva a dibujar; por eso el registro vive en el estado del `PhotosProvider`. Dos esperas distintas: (1) la API (`status`: `loading` → `ready`/`error`; el placeholder **pulsa** solo en `loading`) y (2) el archivo de la imagen (cada `Photo`, por `onLoad`; placeholder quieto y fundido al llegar). La hero **no** pulsa: su reemplazo es el SVG.
- `Photo`, fases de la `<img>`: `waiting` (invisible) → `loaded` (fundido, llegó por la red) o `cached` (visible sin transición, ya estaba disponible al montar). El `ref` que detecta la caché es estable (`useCallback`) y mira dos veces (al montar y en `requestAnimationFrame`) porque el navegador resuelve `<picture>`/`srcset` después de montar. Las imágenes `lazy` ya mostradas que se re-crean pasan por el fundido (no ocurre en esta app: ninguna `Photo` se remonta con la foto visible).
- Si `loadPhotos` falla, `status` pasa a `error` y quedan los placeholders; en desarrollo hay un `console.warn` (en producción no sale nada). Cancelar (StrictMode / desmontar) se ignora sin avisar.
- Para probar fotos reales sin commitear datos falsos: copiar el proyecto a una carpeta temporal, reemplazar `loadPhotos` por uno simulado (con demora, fallos, etc.) y servir las imágenes desde un servidor local.
- LCP: un `<img>` que arranca en `opacity: 0` (el fundido) no cuenta como candidato en Firefox (verificado en una página mínima). Para la foto real de la hero conviene que no dependa del viaje a la API (archivo estático con URL estable y `preload`) y evaluar quitarle el fundido.
- Firefox no baja de ~500 px de ventana: para verificar 360/390 px se carga la página en un iframe del ancho exacto.
