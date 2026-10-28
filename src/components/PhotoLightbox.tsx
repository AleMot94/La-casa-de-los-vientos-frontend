import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n/useI18n'
import { buildSrcSet, fallbackFiles, pickSrc, wrapIndex } from '../lib/photo'
import { usePhotos } from '../photos/usePhotos'
import { Icon } from './Icon'

interface PhotoLightboxProps {
  /** Ids de las fotos, en orden. */
  ids: string[]
  /** Nombre del lugar (habitación o instalación): título de la galería. */
  name: string
  /** Foto con la que se abre (posición en `ids`). */
  startIndex?: number
  /** Texto alternativo de cada foto (ya traducido). */
  alt: (id: string) => string
  /** Se llama cuando la galería se cierra (botón, tecla Esc o clic en el fondo). */
  onClose: () => void
}

const SWIPE_MIN_PX = 50

const control =
  'flex h-11 w-11 items-center justify-center rounded-full bg-canvas/15 text-canvas backdrop-blur-sm transition hover:bg-canvas/30 focus-visible:outline-canvas'

/**
 * Galería a pantalla completa. Usa el `<dialog>` del navegador (`showModal`): el foco queda atrapado adentro,
 * Esc la cierra, el resto de la página queda inerte y el foco vuelve a la tarjeta al cerrar.
 * Se cambia de foto con las flechas del teclado, los botones o deslizando el dedo; al pasar la última
 * vuelve a la primera. Solo se piden la foto actual y sus dos vecinas.
 */
export function PhotoLightbox({ ids, name, startIndex = 0, alt, onClose }: PhotoLightboxProps) {
  const { t } = useI18n()
  const dialog = useRef<HTMLDialogElement>(null)
  const swipeStart = useRef<{ x: number; y: number } | null>(null)
  const [current, setCurrent] = useState(() => wrapIndex(startIndex, ids.length))
  const total = ids.length
  const many = total > 1

  useEffect(() => {
    const el = dialog.current
    if (el && !el.open) el.showModal()
  }, [])

  // Mientras está abierta, la página de atrás no se desplaza.
  useEffect(() => {
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = 'hidden'
    return () => {
      root.style.overflow = previous
    }
  }, [])

  const close = () => dialog.current?.close()
  const go = (delta: number) => setCurrent((index) => wrapIndex(index + delta, total))

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!many) return
    if (e.key === 'ArrowLeft') go(-1)
    else if (e.key === 'ArrowRight') go(1)
  }

  const onPointerDown = (e: React.PointerEvent) => {
    swipeStart.current = (e.target as HTMLElement).closest('button') ? null : { x: e.clientX, y: e.clientY }
  }

  const onPointerUp = (e: React.PointerEvent) => {
    const start = swipeStart.current
    swipeStart.current = null
    if (!start || !many) return
    const dx = e.clientX - start.x
    const dy = e.clientY - start.y
    if (Math.abs(dx) >= SWIPE_MIN_PX && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1)
  }

  // La foto actual y sus vecinas (la anterior y la siguiente) ya quedan descargadas, ocultas.
  const mounted = new Set([current, wrapIndex(current - 1, total), wrapIndex(current + 1, total)])

  return (
    <dialog
      ref={dialog}
      aria-label={t('gallery.label', { name })}
      onClose={onClose}
      onKeyDown={onKeyDown}
      className="fixed inset-0 m-0 size-full max-h-none max-w-none overflow-hidden border-0 bg-ink/95 p-0 text-canvas backdrop:bg-transparent"
    >
      {/* Fondo y fotos: tocar un lugar vacío cierra; deslizar cambia de foto. */}
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) close()
        }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (swipeStart.current = null)}
        className="absolute inset-0 flex touch-pan-y items-center justify-center px-4 py-20 sm:px-20"
      >
        {ids.map((id, index) =>
          mounted.has(index) ? <LightboxPhoto key={id} id={id} alt={alt(id)} visible={index === current} /> : null,
        )}
      </div>

      <h2 className="pointer-events-none absolute top-0 left-0 max-w-[calc(100%-5rem)] truncate px-4 pt-6 font-display text-lead text-canvas sm:px-6">
        {name}
      </h2>

      <button type="button" autoFocus aria-label={t('gallery.close')} onClick={close} className={`${control} absolute top-3 right-3`}>
        <Icon name="close" />
      </button>

      {many && (
        <>
          <button type="button" aria-label={t('gallery.prev')} onClick={() => go(-1)} className={`${control} absolute top-1/2 left-3 -translate-y-1/2`}>
            <Icon name="chevron_left" />
          </button>
          <button type="button" aria-label={t('gallery.next')} onClick={() => go(1)} className={`${control} absolute top-1/2 right-3 -translate-y-1/2`}>
            <Icon name="chevron_right" />
          </button>
          <p
            aria-live="polite"
            className="pointer-events-none absolute inset-x-0 bottom-5 mx-auto w-fit rounded-full bg-canvas/15 px-4 py-1 text-overline font-bold text-canvas backdrop-blur-sm"
          >
            {t('gallery.counter', { current: current + 1, total })}
          </p>
        </>
      )}
    </dialog>
  )
}

interface LightboxPhotoProps {
  id: string
  alt: string
  visible: boolean
}

/** Foto entera (sin recortar) que ocupa todo el espacio posible. Si no es la actual, se descarga pero no se ve. */
function LightboxPhoto({ id, alt, visible }: LightboxPhotoProps) {
  const { getPhoto } = usePhotos()
  const photo = getPhoto(id)
  const fallback = photo ? fallbackFiles(photo) : undefined
  if (!photo || !fallback) return null

  const { avif } = photo.files
  return (
    <picture className={visible ? 'pointer-events-none flex size-full items-center justify-center' : 'hidden'}>
      {avif && avif.length > 0 && fallback !== avif && <source type="image/avif" srcSet={buildSrcSet(avif)} sizes="100vw" />}
      <img
        src={pickSrc(fallback).url}
        srcSet={buildSrcSet(fallback)}
        sizes="100vw"
        width={photo.width}
        height={photo.height}
        alt={alt}
        loading="eager"
        decoding="async"
        draggable={false}
        className="pointer-events-auto h-auto max-h-full w-auto max-w-full rounded-lg object-contain shadow-float select-none"
      />
    </picture>
  )
}
