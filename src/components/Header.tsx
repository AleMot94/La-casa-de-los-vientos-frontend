import { useEffect, useRef, useState } from 'react'
import { navIds } from '../data/nav'
import { siteConfig } from '../data/siteConfig'
import { useI18n } from '../i18n/useI18n'
import { Icon } from './Icon'
import { LanguageSelect } from './LanguageSelect'
import { Logo } from './Logo'

export function Header() {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  // Esc cierra el menú y devuelve el foco al botón que lo abrió.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      toggleRef.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-canvas/90 shadow-[0_1px_8px_rgba(43,38,37,0.05)] backdrop-blur-xl">
      <div className="container-site flex h-20 items-center justify-between gap-3">
        <a
          href="#inicio"
          className="flex min-w-0 items-center"
          aria-label={t('header.logoLabel', { name: siteConfig.name })}
        >
          <Logo kicker={t('header.kicker', { province: siteConfig.location.province })} />
        </a>

        <div className="flex shrink-0 items-center gap-3 lg:gap-8">
          <nav aria-label={t('nav.label')} className="hidden items-center gap-8 lg:flex">
            {navIds.map((id) => (
              <a
                key={id}
                href={`#${id}`}
                className="py-1 text-label whitespace-nowrap text-ink-soft transition-colors hover:text-primary"
              >
                {t(`nav.${id}`)}
              </a>
            ))}
          </nav>

          <LanguageSelect />

          <button
            ref={toggleRef}
            type="button"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded text-primary transition-colors hover:bg-sand lg:hidden"
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? t('header.menuClose') : t('header.menuOpen')}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
      </div>

      {/* Siempre montado (aria-controls apunta acá); `hidden` lo oculta mientras está cerrado. */}
      <nav
        id="menu-movil"
        aria-label={t('nav.label')}
        hidden={!open}
        className="border-t border-mortar bg-canvas lg:hidden"
      >
        <ul className="container-site flex flex-col py-2">
          {navIds.map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={() => setOpen(false)}
                className="block border-b border-mortar py-3.5 text-body font-semibold text-ink last:border-b-0 hover:text-primary"
              >
                {t(`nav.${id}`)}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
