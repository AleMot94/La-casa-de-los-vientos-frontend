import { useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Lang } from '../api/contract'
import { I18nContext, type I18n } from './context'
import { pickLang } from './detect'
import { describeBeds, describeCapacity, formatLongDate } from './format'
import { makeT } from './translate'

const STORAGE_KEY = 'lang'

// localStorage puede no estar disponible (modo privado, datos bloqueados): la página tiene que andar igual.
function readStoredLang(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function storeLang(lang: Lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    /* sin almacenamiento: la elección vale solo para esta visita */
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  // Se calcula una sola vez, antes del primer render: no hay un destello en otro idioma.
  const [lang, setLangState] = useState<Lang>(() =>
    pickLang(readStoredLang(), navigator.languages?.length ? navigator.languages : [navigator.language]),
  )

  const value = useMemo<I18n>(() => {
    const t = makeT(lang)
    return {
      lang,
      // Solo se guarda cuando la persona elige: la detección automática no pisa su decisión.
      setLang: (next) => {
        setLangState(next)
        storeLang(next)
      },
      t,
      describeBeds: (beds) => describeBeds(t, lang, beds),
      describeCapacity: (people) => describeCapacity(t, lang, people),
      formatDate: (iso) => formatLongDate(lang, iso),
    }
  }, [lang])

  // La página es un solo HTML: al cambiar de idioma hay que actualizar `lang`, el título y la descripción.
  useEffect(() => {
    document.documentElement.lang = lang
    document.title = value.t('meta.title')
    document.querySelector('meta[name="description"]')?.setAttribute('content', value.t('meta.description'))
  }, [lang, value])

  return <I18nContext value={value}>{children}</I18nContext>
}
