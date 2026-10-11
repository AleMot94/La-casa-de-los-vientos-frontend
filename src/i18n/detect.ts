import type { Lang } from '../api/contract'
import { DEFAULT_LANG, LANGS } from './translations'

/** Idioma de la página que corresponde a una etiqueta del navegador (`fr-CA` → `fr`), o `null`. */
export function matchLang(tag: string): Lang | null {
  const primary = tag.toLowerCase().split('-')[0]
  if (primary === 'pt') return 'pt-BR' // pt-PT también cae en el portugués de Brasil
  if (primary === 'es' || primary === 'en' || primary === 'fr') return primary
  return null
}

/**
 * Idioma inicial: el que la persona eligió antes (si es válido), si no el primero de los idiomas
 * del navegador que la página ofrezca, y si no, español.
 */
export function pickLang(stored: string | null, browserLanguages: readonly string[]): Lang {
  const chosen = LANGS.find((lang) => lang === stored)
  if (chosen) return chosen
  for (const tag of browserLanguages) {
    const match = matchLang(tag)
    if (match) return match
  }
  return DEFAULT_LANG
}
