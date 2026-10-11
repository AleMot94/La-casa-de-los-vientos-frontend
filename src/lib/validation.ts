import { CONTACT_LIMITS, type ISODate } from '../api/contract'

/**
 * Validación de la consulta del hero. Solo revisa que las fechas y los huéspedes tengan sentido:
 * no consulta ni asume disponibilidad (eso lo responden los dueños por WhatsApp).
 *
 * Son funciones puras (no tocan el DOM ni el reloj), así que se prueban en Node.
 * Devuelven códigos, no textos: el texto traducido lo pone el componente (`booking.error.<código>`).
 */

export type BookingField = 'checkIn' | 'checkOut' | 'guests'

export type BookingErrorCode =
  | 'checkIn.required'
  | 'checkIn.past'
  | 'checkOut.required'
  | 'checkOut.notAfter'
  | 'guests.required'
  | 'guests.range'

/** Un código por campo con error. Un campo sin error no aparece. */
export type BookingErrors = Partial<Record<BookingField, BookingErrorCode>>

export interface BookingInput {
  /** `YYYY-MM-DD`, o `''` si el campo está vacío (así lo entrega `<input type="date">`). */
  checkIn: string
  checkOut: string
  /** Lo que escribió la persona, tal cual (`<input type="number">` entrega texto). */
  guests: string
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

/**
 * `today` es el día de hoy en hora LOCAL (`toISO(today())`), no el de UTC: a las 23:30 en Salta ya es
 * el día siguiente en UTC. Las fechas se comparan como texto: con el formato `YYYY-MM-DD`,
 * el orden alfabético es el orden del calendario.
 */
export function validateBooking(input: BookingInput, today: ISODate, maxGuests: number): BookingErrors {
  const errors: BookingErrors = {}
  const hasCheckIn = ISO_DATE.test(input.checkIn)

  if (!hasCheckIn) errors.checkIn = 'checkIn.required'
  else if (input.checkIn < today) errors.checkIn = 'checkIn.past'

  if (!ISO_DATE.test(input.checkOut)) errors.checkOut = 'checkOut.required'
  else if (hasCheckIn && input.checkOut <= input.checkIn) errors.checkOut = 'checkOut.notAfter'

  const guests = input.guests.trim()
  if (guests === '') errors.guests = 'guests.required'
  else if (!/^\d+$/.test(guests) || Number(guests) < 1 || Number(guests) > maxGuests) errors.guests = 'guests.range'

  return errors
}

// ── Formulario de contacto ──────────────────────────────────────────────────

export type ContactField = 'name' | 'email' | 'phone' | 'message'

export type ContactFormErrorCode =
  | 'name.required'
  | 'name.length'
  | 'email.required'
  | 'email.invalid'
  | 'phone.length'
  | 'message.required'
  | 'message.length'

/** Un código por campo con error. Un campo sin error no aparece. */
export type ContactFormErrors = Partial<Record<ContactField, ContactFormErrorCode>>

export interface ContactInput {
  name: string
  email: string
  /** Opcional: vacío es válido. */
  phone: string
  message: string
}

// Algo@algo.algo, sin espacios. El navegador acepta más (`a@b`); el servidor es quien valida de verdad.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Mismas reglas que los atributos HTML del formulario (`required`, `type="email"`, `minlength`, `maxlength`)
 * y que `CONTACT_LIMITS`. Se mide el texto sin espacios en los bordes, que es lo que se envía.
 */
export function validateContact(input: ContactInput): ContactFormErrors {
  const errors: ContactFormErrors = {}
  const name = input.name.trim()
  const email = input.email.trim()
  const phone = input.phone.trim()
  const message = input.message.trim()

  if (name === '') errors.name = 'name.required'
  else if (name.length < CONTACT_LIMITS.name.min || name.length > CONTACT_LIMITS.name.max) errors.name = 'name.length'

  if (email === '') errors.email = 'email.required'
  else if (!EMAIL.test(email) || email.length > CONTACT_LIMITS.email.max) errors.email = 'email.invalid'

  if (phone.length > CONTACT_LIMITS.phone.max) errors.phone = 'phone.length'

  if (message === '') errors.message = 'message.required'
  else if (message.length < CONTACT_LIMITS.message.min || message.length > CONTACT_LIMITS.message.max) {
    errors.message = 'message.length'
  }

  return errors
}
