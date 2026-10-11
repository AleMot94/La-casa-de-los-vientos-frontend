import type { ISODate, Lang } from '../api/contract'
import { siteConfig } from '../data/siteConfig'
import { formatLongDate } from '../i18n/format'
import type { TFunction } from '../i18n/translate'

/** Enlace click-to-chat de WhatsApp (`wa.me`), con el mensaje ya codificado. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${siteConfig.contact.whatsappNumber}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export interface BookingInquiry {
  checkIn: ISODate
  checkOut: ISODate
  guests: number
  /** Nombre de la habitación elegida; sin él, no se menciona ninguna. */
  room?: string
}

/**
 * Mensaje de consulta para el dueño, en el idioma activo. Las frases viven en los diccionarios
 * (`whatsapp.booking.*`) y las fechas salen con el mes en letras, así nadie confunde 03/04 con 04/03.
 * Es una pregunta: la página no verifica ni confirma nada.
 */
export function bookingMessage(t: TFunction, lang: Lang, { checkIn, checkOut, guests, room }: BookingInquiry): string {
  const lines = [
    t('whatsapp.booking.checkIn', { date: formatLongDate(lang, checkIn) }),
    t('whatsapp.booking.checkOut', { date: formatLongDate(lang, checkOut) }),
    t('whatsapp.booking.guests', { count: guests }),
  ]
  if (room) lines.push(t('whatsapp.booking.room', { room }))
  return `${t('whatsapp.booking.intro', { name: siteConfig.name })}\n\n${lines.join('\n')}`
}
