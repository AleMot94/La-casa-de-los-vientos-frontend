/**
 * Contrato entre el front y el backend (que se hace aparte).
 *
 * Acá solo hay TIPOS y CONSTANTES: ningún código de servidor.
 * Ejemplos, colecciones, endpoints y reglas: docs/backend.md.
 */

export type Lang = 'es' | 'en' | 'fr' | 'pt-BR'

/**
 * Fecha de calendario como texto `YYYY-MM-DD`, sin hora ni zona horaria.
 *
 * Nunca se usa `Date` en el contrato: `new Date('2026-12-15')` se interpreta como
 * medianoche UTC y en Argentina (UTC-3) se muestra como el 14. Como texto, además,
 * las fechas se comparan bien con `<` y `>`.
 */
export type ISODate = string

// ── Catálogo ────────────────────────────────────────────────────────────────
// Hoy vive en src/data/*. Si más adelante pasa a la base, estos son los documentos.

export interface Beds {
  /** Camas matrimoniales (2 personas cada una). */
  double: number
  /** Camas individuales (1 persona cada una). */
  single: number
}

export interface Room {
  /** Identificador estable en minúsculas y con guiones, ej. `sonqoy`. */
  id: string
  /** Número de la habitación (1 a 7). */
  number: number
  /** Nombre propio: no se traduce. */
  name: string
  beds: Beds
  /**
   * Ids de foto: ruta relativa sin extensión, ej. `rooms/01-sonqoy/01`.
   * La capacidad NO se guarda: se calcula (`double * 2 + single`).
   */
  photos: string[]
}

export type FacilityId = 'patios' | 'desayunador' | 'pileta' | 'anfitriones'

export interface Facility {
  id: FacilityId
  /** Posición en la página (1 a 4). */
  order: number
  photos: string[]
}

export type PlatformId = 'airbnb' | 'booking'

export interface Platform {
  id: PlatformId
  /** URL del anuncio. Vacía mientras no esté cargada. */
  url: string
  /** Puntuación opcional, cargada a mano. Sin ella, el bloque de reseñas no se muestra. */
  rating?: number
  /** Escala de la puntuación: Airbnb puntúa de 0 a 5 y Booking de 0 a 10. */
  ratingScale?: 5 | 10
  reviewCount?: number
}

// ── Fotos ───────────────────────────────────────────────────────────────────
// Las fotos las guarda, procesa y sirve el backend. El frontend solo las muestra.

/** Un archivo de imagen de un ancho concreto (la misma foto, en varios tamaños). */
export interface PhotoFile {
  url: string
  /** Ancho real del archivo en píxeles (es el `480w` del `srcset`). */
  width: number
}

/**
 * Una foto lista para mostrar, tal como la devuelve el backend.
 *
 * Recomendaciones para generar los archivos:
 * - Anchos: 480, 800 y 1200 px para tarjetas y galerías; 640, 960, 1280, 1600 y 1920 px para la foto
 *   `hero` (ocupa todo el ancho). El navegador elige el menor que cubra «ancho en pantalla × densidad».
 * - Formatos: AVIF y WebP (el `<img>` de respaldo usa WebP; si no hay, JPEG).
 * - Quitar los metadatos (incluido el GPS) y respetar la rotación EXIF de los celulares.
 * - Los HEIC de iPhone no los leen la mayoría de las librerías: exportarlos a JPG antes.
 */
export interface PhotoData {
  /** El mismo id que usan `Room.photos` y `Facility.photos`, ej. `rooms/01-sonqoy/01`. */
  id: string
  /** Tamaño real del original, para reservar el lugar de la imagen sin saltos de layout. */
  width: number
  height: number
  files: {
    avif?: PhotoFile[]
    webp?: PhotoFile[]
    jpeg?: PhotoFile[]
  }
}

// ── Disponibilidad ──────────────────────────────────────────────────────────

export interface RoomStatus {
  roomId: string
  /** `false` = la habitación no se ofrece. */
  enabled: boolean
}

/**
 * Bloqueo de fechas de una habitación (reserva tomada por otro canal, mantenimiento, etc.).
 * Cubre las NOCHES [from, to): `to` es el día de salida y esa noche queda libre.
 */
export interface AvailabilityBlock {
  id: string
  roomId: string
  from: ISODate
  to: ISODate
  /** Nota interna: solo la ve el administrador. */
  note?: string
}

/** Lo que manda el administrador al crear o editar un bloqueo. */
export type BlockInput = Omit<AvailabilityBlock, 'id'>

/** Respuesta pública de disponibilidad: sin notas ni datos internos. */
export interface AvailabilityResponse {
  statuses: RoomStatus[]
  blocks: Omit<AvailabilityBlock, 'note'>[]
}

// ── Contacto ────────────────────────────────────────────────────────────────

/** Asunto fijo del mail, así llega ordenado. */
export const CONTACT_SUBJECT = 'Consulta desde la web'

/** Largos permitidos. Valen en el front y en el servidor. */
export const CONTACT_LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  phone: { max: 30 },
  message: { min: 10, max: 2000 },
} as const

export interface ContactRequest {
  name: string
  email: string
  phone?: string
  message: string
  /** Idioma activo de la página. */
  language: Lang
  subject: string
  /** Honeypot: campo oculto que una persona no ve. Si llega lleno, es un bot. */
  website?: string
}

export type ContactErrorCode = 'invalid' | 'rate_limited' | 'unavailable'

/** HTTP 200 con `ok: true`; 400 `invalid`; 429 `rate_limited`; 503 `unavailable`. */
export type ContactResponse =
  | { ok: true }
  | { ok: false; error: ContactErrorCode; fields?: string[] }
