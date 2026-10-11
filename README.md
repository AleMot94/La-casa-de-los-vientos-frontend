# La Casa de los Vientos

Sitio web de una hostería en San Carlos, Valle Calchaquí, Salta, Argentina. Una sola página en cuatro idiomas
(español, inglés, francés y portugués de Brasil) para que la gente conozca la hostería y **consulte por WhatsApp**.

**La disponibilidad no se maneja en la página:** los dueños la responden a mano por WhatsApp. El formulario del hero
solo arma un mensaje de consulta y abre WhatsApp.

Stack: React + Vite + TypeScript + Tailwind CSS v4. Tests con Vitest.

## Comandos

```bash
npm install
npm run dev      # servidor de desarrollo → http://localhost:5173
npm run build    # chequeo de tipos (tsc) + build de producción en dist/
npm run preview  # sirve dist/ (sirve para probar el build)
npm run lint     # oxlint
npm test         # vitest
```

## Variable de entorno

Hay **una sola**: `VITE_CONTACT_ENDPOINT`, la URL de tu backend para el formulario de contacto.

1. Copiá `.env.example` a `.env` y poné la URL (por ejemplo `/api/contact`, o `https://tu-dominio.com/api/contact`).
2. Para desarrollo con un backend en otro puerto, la URL completa (y el backend tiene que permitir CORS: ver abajo).

**Importante**
- Vite reemplaza `import.meta.env.VITE_*` por su valor **al compilar**. Queda escrita en el JavaScript que baja
  cualquier visitante: por eso nunca va una clave secreta ahí.
- Por lo mismo, **si cambiás la variable en el hosting hay que volver a compilar y desplegar**; reiniciar no alcanza.
- Sin la variable: en desarrollo el formulario se ve con una advertencia y el botón de envío deshabilitado; en
  producción **el formulario no se muestra** (queda el resto de los datos de contacto: WhatsApp, teléfono, mail,
  Instagram y mapa).

## Contrato del backend de contacto

El formulario hace `POST {VITE_CONTACT_ENDPOINT}` con `Content-Type: application/json` y este cuerpo
(`ContactRequest`, en `src/api/contract.ts`):

```json
{
  "name": "Ana Pérez",
  "email": "ana@correo.com",
  "phone": "+54 9 3868 46-3838",
  "message": "Quisiera consultar por una estadía en diciembre.",
  "language": "es",
  "subject": "Consulta desde la web"
}
```

`phone` es opcional (no se envía si está vacío) y `website` (honeypot) no se envía nunca desde el formulario real.
Límites (`CONTACT_LIMITS`): nombre 2–100, email hasta 254, teléfono hasta 30, mensaje 10–2000 caracteres.

La respuesta tiene que ser un `ContactResponse`:

| Caso | HTTP | Cuerpo |
|---|---|---|
| Enviado | 200 | `{ "ok": true }` |
| Datos inválidos | 400 | `{ "ok": false, "error": "invalid", "fields": ["email"] }` |
| Demasiados envíos | 429 | `{ "ok": false, "error": "rate_limited" }` |
| No se pudo enviar el mail | 503 | `{ "ok": false, "error": "unavailable" }` |

Cualquier otra cosa (un cuerpo que no cumple el contrato, una página de error de un proxy, un corte de red o más de
15 segundos sin respuesta) la página la trata como `unavailable`: **nunca da por enviado un mensaje que no se confirmó**.

### Qué debería hacer el backend con este POST

1. **Limitar el tamaño del cuerpo** (unos pocos KB alcanzan).
2. **Honeypot primero:** si `website` viene con algo, responder `200 { "ok": true }` y descartar sin enviar nada.
3. **Validar de nuevo, siempre.** Lo que hizo el navegador se puede saltear: mismos límites, email válido, tipos correctos.
4. **Anti-spam:** límite por IP (y quizá por email) con `429`, chequeo de la cabecera `Origin` y, si hace falta, un captcha.
5. **Enviar el mail** con un proveedor: el destino vive **solo en el servidor**, el asunto es el recibido, el cuerpo es
   texto plano con los datos y el idioma. Usar un `From` de tu dominio (SPF/DKIM, para no caer en spam) y poner el email
   del visitante en `Reply-To`. Sacar los saltos de línea de nombre y email antes de usarlos en cabeceras (inyección).
6. **Responder** `200` solo si el proveedor aceptó el mail; si falla, `503`. No devolver detalles internos.
7. **CORS:** lo más simple es servir el sitio y la API desde el mismo origen (con un proxy). Si son distintos, responder
   `OPTIONS` y `Access-Control-Allow-Origin` con el dominio exacto del sitio (no `*`): el `Content-Type: application/json`
   hace que el navegador pregunte antes con un `OPTIONS`.

## Fotos

Las fotos las sirve el backend. El frontend las pide una sola vez en `loadPhotos` (`src/api/photos.ts`, hoy devuelve una
lista vacía y la página muestra placeholders) y espera una lista de `PhotoData` (`src/api/contract.ts`).

## Estructura

La guía completa de la estructura y las convenciones está en `CLAUDE.md`. Los textos visibles viven en `src/i18n/`
(español es la fuente de verdad) y los datos del negocio, solo en `src/data/siteConfig.ts`.
