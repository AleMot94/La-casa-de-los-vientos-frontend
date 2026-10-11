import { useContext } from 'react'
import { I18nContext, type I18n } from './context'

/** `const { t, lang } = useI18n()` en cualquier componente dentro de `<I18nProvider>`. */
export function useI18n(): I18n {
  const value = useContext(I18nContext)
  if (!value) throw new Error('useI18n tiene que usarse dentro de <I18nProvider>')
  return value
}
