import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n/useI18n'
import { Photo, PhotoPlaceholder, type PhotoRatio } from './Photo'

interface PhotoCarouselProps {
  /** Ids de las fotos, en orden (ej. `['about/01', 'about/02', 'about/03']`). */
  ids: string[]
  /** Texto alternativo de cada foto (ya traducido). `index` empieza en 0. */
  alt: (index: number, total: number) => string
  ratio: PhotoRatio
  sizes: string
  /** Milisegundos que se queda cada foto antes de pasar a la siguiente. */
  intervalMs?: number
  /** Se dibuja encima de las fotos (ej. la tarjeta con el pie). Debe ser `absolute`. */
  children?: React.ReactNode
  className?: string
}

/**
 * Carrusel que avanza solo, de a una foto. Se detiene cuando:
 * - la persona pasa el puntero o enfoca el carrusel,
 * - la pestaña no está visible o el carrusel no está en pantalla,
 * - el sistema pide movimiento reducido (en ese caso no avanza solo; se cambia con los puntos).
 * Las fotos 2 en adelante recién se piden cuando el carrusel se acerca a la pantalla.
 */
export function PhotoCarousel({ ids, alt, ratio, sizes, intervalMs = 5000, children, className = '' }: PhotoCarouselProps) {
  const { t } = useI18n()
  const root = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [near, setNear] = useState(false) // alguna vez estuvo cerca de la pantalla: se piden todas las fotos
  const [onScreen, setOnScreen] = useState(false)
  const [tabVisible, setTabVisible] = useState(() => document.visibilityState === 'visible')
  const [reduceMotion, setReduceMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  const total = ids.length

  useEffect(() => {
    const el = root.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setOnScreen(entry.isIntersecting && entry.intersectionRatio >= 0.4)
        if (entry.isIntersecting) setNear(true)
      },
      { threshold: [0, 0.4], rootMargin: '300px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onVisibility = () => setTabVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', onVisibility)
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onMotion = () => setReduceMotion(media.matches)
    media.addEventListener('change', onMotion)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      media.removeEventListener('change', onMotion)
    }
  }, [])

  const playing = total > 1 && !reduceMotion && !hovered && !focused && tabVisible && onScreen

  // Un timeout por foto (no un intervalo): al cambiar a mano, la cuenta vuelve a empezar.
  useEffect(() => {
    if (!playing) return
    const timer = window.setTimeout(() => setCurrent((c) => (c + 1) % total), intervalMs)
    return () => window.clearTimeout(timer)
  }, [playing, current, total, intervalMs])

  return (
    <div
      ref={root}
      role="group"
      aria-roledescription="carousel"
      aria-label={t('about.carousel.label')}
      className={`relative overflow-hidden ${className}`}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false)
      }}
    >
      <ul
        className="flex transition-transform duration-700 ease-out motion-reduce:transition-none"
        style={{ transform: `translateX(-${current * 100}%)` }}
        aria-live={playing ? 'off' : 'polite'}
      >
        {ids.map((id, index) => (
          <li
            key={id}
            // Las fotos que no se ven no reciben foco ni las lee el lector de pantalla.
            inert={index !== current}
            aria-hidden={index !== current}
            className="w-full shrink-0"
          >
            {index === 0 || near ? (
              <Photo id={id} alt={alt(index, total)} ratio={ratio} sizes={sizes} loading={index === 0 ? 'lazy' : 'eager'} />
            ) : (
              <PhotoPlaceholder id={id} ratio={ratio} />
            )}
          </li>
        ))}
      </ul>

      {children}

      {total > 1 && (
        <div className="absolute inset-x-0 top-3 flex justify-center gap-1">
          {ids.map((id, index) => (
            <button
              key={id}
              type="button"
              aria-label={t('about.carousel.goTo', { current: index + 1, total })}
              aria-current={index === current}
              onClick={() => setCurrent(index)}
              className="flex h-6 w-6 items-center justify-center rounded-full"
            >
              <span
                className={`h-2 rounded-full shadow-soft transition-all duration-300 motion-reduce:transition-none ${
                  index === current ? 'w-6 bg-white' : 'w-2 bg-white/60'
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
