import { useEffect, useState } from 'react'
import { brand, navItems } from '../data/site'
import { Icon } from './Icon'
import { Logo } from './Logo'

export function Header() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-canvas/90 shadow-[0_1px_8px_rgba(43,38,37,0.05)] backdrop-blur-xl">
      <div className="container-site flex h-20 items-center justify-between gap-2 sm:gap-4">
        <a href="#top" className="flex min-w-0 items-center gap-2 sm:gap-3" aria-label={`${brand.name}, inicio`}>
          <Logo className="h-8 w-8 shrink-0 sm:h-9 sm:w-9" />
          <span className="flex min-w-0 flex-col">
            <span className="font-display text-base leading-tight font-semibold tracking-tight text-primary sm:text-card">
              {brand.name}
            </span>
            <span className="kicker hidden text-secondary-deep sm:block">{brand.kicker}</span>
          </span>
        </a>

        <nav aria-label="Principal" className="hidden items-center gap-5 2xl:gap-7 xl:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="py-1 text-label whitespace-nowrap text-ink-soft transition-colors hover:text-primary"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-3">
          <div
            className="hidden items-center gap-1 rounded-full bg-sand px-2 py-1 text-overline font-bold sm:flex"
            role="group"
            aria-label="Idioma"
          >
            <span className="px-1 text-primary" aria-current="true">ES</span>
            <span className="text-mortar" aria-hidden="true">|</span>
            <span className="px-1 text-ink-soft/60" title="Próximamente">EN</span>
            <span className="text-mortar" aria-hidden="true">|</span>
            <span className="px-1 text-ink-soft/60" title="Próximamente">PT</span>
          </div>
          <a
            href="#habitaciones"
            aria-label="Consultar disponibilidad"
            className="inline-flex h-10 items-center justify-center gap-2 rounded bg-primary px-3 text-label text-canvas transition-colors hover:bg-primary-deep sm:px-5"
          >
            <Icon name="calendar_today" className="!text-[20px] sm:hidden" />
            <span className="hidden min-[420px]:inline sm:hidden">Reservar</span>
            <span className="hidden sm:inline">Consultar Disponibilidad</span>
          </a>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded text-primary transition-colors hover:bg-sand xl:hidden"
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="menu-movil"
          aria-label="Principal"
          className="border-t border-mortar bg-canvas xl:hidden"
        >
          <ul className="container-site flex flex-col py-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-mortar py-3.5 text-body font-semibold text-ink last:border-b-0 hover:text-primary"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
