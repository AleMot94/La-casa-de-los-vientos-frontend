import { useId } from 'react'
import type { Lang } from '../api/contract'
import { LANG_CODES, LANG_NAMES, LANGS } from '../i18n/translations'
import { useI18n } from '../i18n/useI18n'
import { Icon } from './Icon'

/**
 * Selector de idioma. Es un <select> nativo: en el celular abre el selector del sistema y los lectores de
 * pantalla lo conocen. Muestra el código corto (ES, EN…) para que entre en el header; la fuente es de
 * 16 px para que iOS no haga zoom al tocarlo.
 */
export function LanguageSelect() {
  const { lang, setLang, t } = useI18n()
  const id = useId()

  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {t('lang.label')}
      </label>
      <select
        id={id}
        value={lang}
        onChange={(e) => setLang(e.target.value as Lang)}
        className="h-11 cursor-pointer appearance-none rounded-full bg-sand pr-8 pl-4 text-[16px] font-bold text-primary transition-colors hover:bg-mortar"
      >
        {LANGS.map((code) => (
          <option key={code} value={code} lang={code} aria-label={LANG_NAMES[code]}>
            {LANG_CODES[code]}
          </option>
        ))}
      </select>
      <Icon
        name="expand_more"
        className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 !text-[20px] text-primary"
      />
    </div>
  )
}
