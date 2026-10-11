export function pad(n: number): string {
  return String(n).padStart(2, '0')
}

/** Fecha local en formato `YYYY-MM-DD` (el que usan los `<input type="date">`). */
export function toISO(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/**
 * `'2026-12-15'` → medianoche LOCAL del 15 de diciembre.
 * No se usa `new Date('2026-12-15')`: eso es medianoche UTC y en Argentina (UTC-3) cae el día 14.
 */
export function fromISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(d: Date, days: number): Date {
  const next = new Date(d)
  next.setDate(next.getDate() + days)
  return next
}

/** Hoy a medianoche, en hora local. */
export function today(): Date {
  const t = new Date()
  return new Date(t.getFullYear(), t.getMonth(), t.getDate())
}
