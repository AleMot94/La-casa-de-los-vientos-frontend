import type { Lang } from '../api/contract'
import { en } from './en'
import { es, type Translation } from './es'
import { fr } from './fr'
import { ptBR } from './pt-BR'

/** Todas las claves de traducción válidas (salen del diccionario en español). */
export type TranslationKey = keyof Translation

export const translations: Record<Lang, Translation> = { es, en, fr, 'pt-BR': ptBR }

export const LANGS: readonly Lang[] = ['es', 'en', 'fr', 'pt-BR']
export const DEFAULT_LANG: Lang = 'es'

/** Código corto: es lo que se ve en el selector (entra en el header de un celular). */
export const LANG_CODES: Record<Lang, string> = { es: 'ES', en: 'EN', fr: 'FR', 'pt-BR': 'PT' }

/** Nombre de cada idioma, escrito en ese mismo idioma (para lectores de pantalla). */
export const LANG_NAMES: Record<Lang, string> = {
  es: 'Español',
  en: 'English',
  fr: 'Français',
  'pt-BR': 'Português (Brasil)',
}
