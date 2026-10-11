import { createContext } from 'react'
import type { Beds, ISODate, Lang } from '../api/contract'
import type { TFunction } from './translate'

/** Lo que cualquier componente puede pedirle al sistema de idiomas (ver `useI18n`). */
export interface I18n {
  lang: Lang
  setLang: (lang: Lang) => void
  t: TFunction
  /** «1 cama matrimonial y 2 camas individuales», en el idioma activo. */
  describeBeds: (beds: Beds) => string
  /** «4 personas», en el idioma activo. */
  describeCapacity: (people: number) => string
  /** `'2026-12-15'` → «15 de diciembre de 2026», en el idioma activo. */
  formatDate: (iso: ISODate) => string
}

export const I18nContext = createContext<I18n | null>(null)
