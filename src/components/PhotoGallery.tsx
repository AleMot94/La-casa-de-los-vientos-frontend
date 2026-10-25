import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n/useI18n'
import { usePhotos } from '../photos/usePhotos'
import { Icon } from './Icon'
import { Photo, PhotoPlaceholder, type PhotoRatio } from './Photo'

interface PhotoGalleryProps {
  /** Carpeta de las fotos (`rooms/01-sonqoy`): se muestran todas las numeradas que el backend entregó, en orden. */
  folder: string
  /** Nombre del lugar (habitación o instalación): arma el texto alternativo y la etiqueta. */
  name: string
  ratio: PhotoRatio
  /** Cuánto ocupa cada foto en pantalla (ver `Photo`). */
  sizes: string
  className?: string
}

/**
 * Fotos de una habitación o instalación, tantas como entregue el backend para su carpeta. Sin fotos, el
 * placeholder; con una sola, la foto; con varias, un carrusel que se desliza (CSS `scroll-snap`) y carga
 * cada foto recién cuando se acerca.
 */
export function PhotoGallery({ folder, name, ratio, sizes, className = '' }: PhotoGalleryProps) {
  const { t } = useI18n()
  const { status, idsIn } = usePhotos()
  const ids = idsIn(folder)
  const alt = (id: string) => t('photo.alt', { name, n: ids.indexOf(id) + 1 })

  if (ids.length === 0) {
    return <PhotoPlaceholder id={`${folder}/01`} ratio={ratio} pulsing={status === 'loading'} className={className} />
  }
  if (ids.length === 1) {
    return <Photo id={ids[0]} alt={alt(ids[0])} ratio={ratio} sizes={sizes} className={className} />
  }
  return <Carousel ids={ids} name={name} alt={alt} ratio={ratio} sizes={sizes} className={className} />
}

interface CarouselProps extends Omit<PhotoGalleryProps, 'folder'> {
  ids: string[]
  alt: (id: string) => string
}

const withIndex = (set: ReadonlySet<number>, index: number): ReadonlySet<number> =>
  set.has(index) ? set : new Set(set).add(index)

const arrow =
  'absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-canvas/90 text-primary shadow-soft backdrop-blur-sm transition hover:bg-canvas disabled:pointer-events-none disabled:opacity-0'

function Carousel({ ids, name, alt, ratio, sizes, className = '' }: CarouselProps) {
  const { t } = useI18n()
  const scroller = useRef<HTMLUListElement>(null)
  const [current, setCurrent] = useState(0)
  // Slides cuya foto ya se pidió: la primera desde el inicio, las demás cuando se acercan.
  const [requested, setRequested] = useState<ReadonlySet<number>>(() => new Set([0]))
  const last = ids.length - 1

  const request = (index: number) => {
    if (index >= 0 && index <= last) setRequested((prev) => withIndex(prev, index))
  }

  // Una foto se pide cuando su slide empieza a asomar al deslizar. `intersectionRatio > 0` evita que la
  // slide vecina (que solo toca el borde) se pida de entrada. El observador mira dentro del carrusel.
  useEffect(() => {
    const root = scroller.current
    if (!root) return
    const slides = Array.from(root.children)
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.intersectionRatio > 0) {
            const index = slides.indexOf(entry.target)
            setRequested((prev) => withIndex(prev, index))
          }
        }
      },
      { root, threshold: [0, 0.01] },
    )
    slides.forEach((slide) => observer.observe(slide))
    return () => observer.disconnect()
  }, [ids.length])

  const goTo = (index: number) => {
    const root = scroller.current
    if (!root) return
    const target = Math.max(0, Math.min(last, index))
    request(target)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    root.scrollTo({ left: target * root.clientWidth, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  // Señales de que la persona va a usar la galería: se adelanta la foto siguiente.
  const warmUp = () => request(current + 1)

  return (
    <div
      role="group"
      aria-label={t('gallery.label', { name })}
      className={`relative overflow-hidden ${className}`}
      onPointerEnter={warmUp}
      onPointerDown={warmUp}
      onFocus={warmUp}
    >
      <ul
        ref={scroller}
        tabIndex={0}
        onScroll={(e) => setCurrent(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
        className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] focus-visible:outline-offset-[-3px] [&::-webkit-scrollbar]:hidden"
      >
        {ids.map((id, index) => (
          <li key={id} className="w-full shrink-0 snap-center">
            {requested.has(index) ? (
              <Photo id={id} alt={alt(id)} ratio={ratio} sizes={sizes} loading={index === 0 ? 'lazy' : 'eager'} />
            ) : (
              <PhotoPlaceholder id={id} ratio={ratio} />
            )}
          </li>
        ))}
      </ul>

      <button
        type="button"
        aria-label={t('gallery.prev')}
        disabled={current === 0}
        onClick={() => goTo(current - 1)}
        className={`${arrow} left-3`}
      >
        <Icon name="chevron_left" />
      </button>
      <button
        type="button"
        aria-label={t('gallery.next')}
        disabled={current === last}
        onClick={() => goTo(current + 1)}
        className={`${arrow} right-3`}
      >
        <Icon name="chevron_right" />
      </button>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 bottom-3 rounded-full bg-ink/60 px-3 py-1 text-overline font-bold text-canvas"
      >
        {t('gallery.counter', { current: current + 1, total: ids.length })}
      </span>
    </div>
  )
}
