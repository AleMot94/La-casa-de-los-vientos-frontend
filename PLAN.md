# Estado del proyecto y pendientes

Reemplaza al plan viejo (que hablaba de calendario y modal de reservas, cosas que ya no existen). La guía de
estructura y convenciones está en `CLAUDE.md`; el arranque, la variable de entorno y el contrato del backend, en `README.md`.

## Hecho (rama `feat/landing-v2`)
- **Datos y contrato:** `src/data/*` (7 habitaciones, 4 instalaciones, plataformas, datos del negocio) y `src/api/contract.ts`.
- **Idiomas:** español, inglés, francés y portugués de Brasil, con diccionarios tipados y selector. fr y pt-BR son un primer borrador.
- **Fotos:** `Photo` y `PhotoGallery` (carrusel con carga diferida) y el registro de fotos en un Context (`PhotosProvider`). Las fotos las sirve el backend y el front muestra todas las de cada carpeta (`GET /api/photos` conectado por el proxy de Vite).
- **Hero → WhatsApp:** formulario de consulta con validación y mensaje en el idioma activo.
- **Contacto:** mapa, tarjetas de Airbnb/Booking y formulario hacia el backend propio (`VITE_CONTACT_ENDPOINT`).

## Regla de negocio
**La disponibilidad se maneja a mano, por WhatsApp.** La página no la muestra, no la calcula ni promete confirmaciones o plazos.

## Pendiente (lo que solo puede aportar el dueño o quien hace el backend)
`grep -rn TODO src` lista los placeholders visibles.
- URLs de los anuncios de Airbnb y Booking en `src/data/platforms.ts` (y, si se quiere, puntuación y cantidad de reseñas).
- Textos de Patios, Desayunador, Pileta y Anfitriones, en los 4 idiomas.
- Logo: un archivo `src/assets/logo.svg|png|webp|jpg` (se detecta solo).
- Producción: compilar con `VITE_CONTACT_ENDPOINT=/api/contact` y que el servidor web reenvíe `/api/` y `/photos/` al backend (ver `FRONTEND.md`, sección 7).
- Línea de privacidad del formulario: confirmar el texto definitivo (hoy lleva `TODO`).
- Revisión humana de fr y pt-BR, y confirmar las afirmaciones heredadas del mockup (`TODO(confirmar)` en `src/i18n/es.ts`).
- Open Graph: las etiquetas ya están en `index.html`; falta `og:image` (la define el dueño) y `og:url` (cuando haya dominio). Mismo caso para el `Sitemap:` de `public/robots.txt`.
- Elegir hosting (ver las condiciones de uso: algunos planes gratuitos son solo para uso no comercial).

## Cuando haya foto real de la hero
La foto que llega por la API aparece después de: bajar el JS → dibujar → pedir la API → bajar la imagen, en serie, y eso retrasa el LCP.
Recomendado: servir esa foto como archivo estático del sitio, con URL estable y `<link rel="preload" as="image">` en `index.html`
(el resto de las fotos sigue por API), y evaluar quitarle el fundido a la hero.
