import type { Beds, ISODate, Lang } from '../api/contract'
import { fromISO } from '../lib/dates'
import type { TFunction } from './translate'

/** Plural según el idioma. Para estos textos alcanza con «uno» u «otro». */
function pluralForm(lang: Lang, n: number): 'one' | 'other' {
  return new Intl.PluralRules(lang).select(n) === 'one' ? 'one' : 'other'
}

/** `{ double: 1, single: 2 }` → «1 cama matrimonial y 2 camas individuales» (o su equivalente en el idioma). */
export function describeBeds(t: TFunction, lang: Lang, { double, single }: Beds): string {
  const parts: string[] = []
  if (double) parts.push(t(`beds.double.${pluralForm(lang, double)}`, { count: double }))
  if (single) parts.push(t(`beds.single.${pluralForm(lang, single)}`, { count: single }))
  return new Intl.ListFormat(lang, { style: 'long', type: 'conjunction' }).format(parts)
}

/** `4` → «4 personas». */
export function describeCapacity(t: TFunction, lang: Lang, people: number): string {
  return t(`capacity.${pluralForm(lang, people)}`, { count: people })
}

/**
 * Fecha con el mes en letras: `'2026-12-15'` → «15 de diciembre de 2026».
 * `fromISO` arma la fecha con partes locales: así el día no se corre por la zona horaria.
 */
export function formatLongDate(lang: Lang, iso: ISODate): string {
  return new Intl.DateTimeFormat(lang, { dateStyle: 'long' }).format(fromISO(iso))
}
