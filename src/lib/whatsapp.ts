import { contact } from '../data/site'

export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${contact.whatsappNumber}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}
