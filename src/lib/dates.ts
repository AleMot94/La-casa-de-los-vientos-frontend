const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

export function pad(n: number): string {
  return String(n).padStart(2, '0')
}

/** Fecha local en formato `YYYY-MM-DD` (el que usan los `<input type="date">`). */
export function toISO(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function fromISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(d: Date, days: number): Date {
  const next = new Date(d)
  next.setDate(next.getDate() + days)
  return next
}

export function today(): Date {
  const t = new Date()
  return new Date(t.getFullYear(), t.getMonth(), t.getDate())
}

export function monthName(month: number): string {
  return MONTHS[month]
}

/** `12 Abr 2026` */
export function formatShort(iso: string): string {
  if (!iso) return ''
  const d = fromISO(iso)
  return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0
  const diff = fromISO(checkOut).getTime() - fromISO(checkIn).getTime()
  return Math.max(0, Math.round(diff / 86_400_000))
}
