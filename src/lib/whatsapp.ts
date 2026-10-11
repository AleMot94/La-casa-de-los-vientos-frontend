import { siteConfig } from '../data/siteConfig'

/** Enlace click-to-chat de WhatsApp (`wa.me`), con el mensaje ya codificado. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${siteConfig.contact.whatsappNumber}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}
