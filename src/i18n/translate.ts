import type { Lang } from '../api/contract'
import { translations, type TranslationKey } from './translations'

export type Vars = Record<string, string | number>
export type TFunction = (key: TranslationKey, vars?: Vars) => string

/**
 * Devuelve la función `t` de un idioma: busca la clave y reemplaza `{nombre}` por su valor.
 * Si falta una variable, deja el `{nombre}` a la vista para que se note.
 */
export function makeT(lang: Lang): TFunction {
  const dictionary = translations[lang]
  return (key, vars) => {
    const text = dictionary[key]
    if (!vars) return text
    return text.replace(/\{(\w+)\}/g, (match, name: string) => (name in vars ? String(vars[name]) : match))
  }
}
