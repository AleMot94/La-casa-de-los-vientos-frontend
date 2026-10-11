import { useEffect, useRef, useState } from 'react'
import { navItems } from '../data/nav'
import { siteConfig } from '../data/siteConfig'
import { Icon } from './Icon'
import { Logo } from './Logo'

export function Header() {
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
      <div className="container-site flex h-20 items-center justify-between gap-4">
        <a href="#inicio" className="flex min-w-0 items-center" aria-label={`${siteConfig.name}, inicio`}>
          <Logo kicker="Hostería · Salta" />
        </a>

        <nav aria-label="Principal" className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="py-1 text-label whitespace-nowrap text-ink-soft transition-colors hover:text-primary"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded text-primary transition-colors hover:bg-sand lg:hidden"
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? 'close' : 'menu'} />
        </button>
      </div>

      {/* Siempre montado (aria-controls apunta acá); `hidden` lo oculta mientras está cerrado. */}
      <nav id="menu-movil" aria-label="Principal" hidden={!open} className="border-t border-mortar bg-canvas lg:hidden">
        <ul className="container-site flex flex-col py-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={() => setOpen(false)}
                className="block border-b border-mortar py-3.5 text-body font-semibold text-ink last:border-b-0 hover:text-primary"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
