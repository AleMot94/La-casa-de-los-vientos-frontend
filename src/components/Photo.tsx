import { useCallback, useState } from 'react'
import { flushSync } from 'react-dom'
import { buildSrcSet, fallbackFiles, pickSrc } from '../lib/photo'
import { usePhotos } from '../photos/usePhotos'
import { Icon } from './Icon'

/** Proporciones permitidas. Son clases completas para que Tailwind las detecte al compilar. */
const RATIO = {
  '4/3': 'aspect-[4/3]',
  '3/2': 'aspect-[3/2]',
  '4/5': 'aspect-[4/5]',
  '16/9': 'aspect-video',
} as const

export type PhotoRatio = keyof typeof RATIO

interface PlaceholderProps {
  /** Id de la foto que falta (en desarrollo se muestra para saber qué archivo se espera). */
  id: string
  /** Proporción propia. Sin ella ocupa todo el alto de quien lo contiene (cuando va debajo de una foto). */
  ratio?: PhotoRatio
  /** Late mientras se espera la respuesta del backend (se apaga con movimiento reducido). */
  pulsing?: boolean
  className?: string
}

/** Bloque neutro con la proporción exacta: ocupa el lugar de una foto que todavía no existe. */
export function PhotoPlaceholder({ id, ratio, pulsing = false, className = '' }: PlaceholderProps) {
  return (
    <div
      aria-hidden="true"
      className={`w-full overflow-hidden bg-mortar ${ratio ? RATIO[ratio] : 'h-full'} ${className} ${
        pulsing ? 'animate-pulse motion-reduce:animate-none' : ''
      }`}
    >
      <div className="relative flex h-full w-full items-center justify-center">
        <Icon name="photo_camera" className="!text-[40px] text-ink-soft/40" />
        {import.meta.env.DEV && (
          <span className="absolute bottom-2 left-2 rounded bg-canvas/80 px-2 py-0.5 font-mono text-[10px] text-ink-soft">
            {id}
          </span>
        )}
      </div>
    </div>
  )
}

interface PhotoProps {
  /** Id de la foto, ej. `rooms/01-sonqoy/01`. Sus datos los entrega el backend (ver `usePhotos`). */
  id: string
  alt: string
  /** Proporción del contenedor. Sin ella, el tamaño lo define quien lo contiene (ej. la hero). */
  ratio?: PhotoRatio
  /**
   * Cuánto ocupa la imagen en pantalla (CSS, ej. `(min-width: 1280px) 395px, 100vw`).
   * El navegador lo cruza con la densidad de la pantalla para elegir el archivo del `srcset`.
   */
  sizes?: string
  /** Imagen de la primera pantalla (LCP): se pide ya y con prioridad alta, sin carga diferida. */
  priority?: boolean
  /** Carga: `lazy` espera a que la imagen esté cerca de la pantalla; `eager` la pide ya. */
  loading?: 'lazy' | 'eager'
  /** Imagen de reemplazo mientras la foto no exista (ej. el SVG de la hero). No pulsa. */
  fallbackSrc?: string
  className?: string
}

/**
 * Fase de una foto que ya tiene datos, mientras su archivo baja:
 * - `waiting`: el archivo todavía no llegó → la `<img>` está invisible sobre el placeholder;
 * - `cached`: ya estaba disponible al montar (caché) → se ve de una vez, SIN transición;
 * - `loaded`: llegó por la red → aparece con un fundido.
 */
type Phase = 'waiting' | 'cached' | 'loaded'

const IMG_CLASS: Record<Phase, string> = {
  waiting: 'opacity-0',
  cached: 'opacity-100',
  loaded: 'opacity-100 transition-opacity duration-300 motion-reduce:transition-none',
}

/**
 * Foto con proporción fija. Cuando el backend ya entregó sus datos arma un `<picture>` con AVIF y WebP,
 * `srcset` y `sizes`; mientras tanto (o si no existe) muestra el placeholder, que pulsa solo mientras se
 * espera la respuesta del backend. El contenedor mantiene su proporción, así el layout no salta.
 * No define su propia posición: quien lo usa puede pasarle `absolute inset-0` (la hero).
 */
export function Photo({
  id,
  alt,
  ratio,
  sizes = '100vw',
  priority = false,
  loading = 'lazy',
  fallbackSrc,
  className = '',
}: PhotoProps) {
  const { status, getPhoto } = usePhotos()
  const photo = getPhoto(id)
  const fallback = photo ? fallbackFiles(photo) : undefined
  const [phase, setPhase] = useState<Phase>('waiting')

  // Se ejecuta cuando la <img> se monta. Si el archivo ya estaba disponible (caché en memoria), pasa a `cached`
  // ANTES del primer dibujo, así no hay fundido ni destello. Se mira dos veces: al montar y justo antes del primer
  // dibujo (`requestAnimationFrame`), porque el navegador resuelve el <picture>/`srcset` un instante después de
  // montar y recién ahí la imagen figura como `complete`. `flushSync` aplica el cambio en ese mismo cuadro.
  // Es estable (`useCallback` con `[]`): un `ref` en línea cambia en cada render y React lo volvería a ejecutar
  // siempre. Además la actualización es funcional: si la fase ya no es `waiting` devuelve el mismo valor y React
  // no vuelve a dibujar. Dos capas contra un bucle de renders.
  const markIfCached = useCallback((img: HTMLImageElement | null) => {
    if (!img) return
    const check = () => {
      if (img.complete && img.naturalWidth > 0) {
        setPhase((current) => (current === 'waiting' ? 'cached' : current))
      }
    }
    check()
    requestAnimationFrame(() => flushSync(check))
  }, [])

  const box = `overflow-hidden ${ratio ? RATIO[ratio] : ''} ${className}`

  if (!photo || !fallback) {
    if (fallbackSrc) {
      return (
        <div className={box}>
          <img src={fallbackSrc} alt={alt} className="h-full w-full object-cover" />
        </div>
      )
    }
    return <PhotoPlaceholder id={id} ratio={ratio ?? '4/3'} pulsing={status === 'loading'} className={className} />
  }

  // El navegador usa el primer <source> que entiende (AVIF); si no, el <img>, que es WebP (o JPEG).
  const { avif } = photo.files
  return (
    <div className={box}>
      <div className="relative h-full w-full">
        {/* Debajo, quieto: lo que se ve mientras baja el archivo. */}
        {fallbackSrc ? (
          <img src={fallbackSrc} alt="" className="h-full w-full object-cover" />
        ) : (
          <PhotoPlaceholder id={id} />
        )}
        {/* Encima, invisible hasta que el archivo llega. */}
        <picture className="absolute inset-0 block">
          {avif && avif.length > 0 && fallback !== avif && (
            <source type="image/avif" srcSet={buildSrcSet(avif)} sizes={sizes} />
          )}
          <img
            ref={markIfCached}
            onLoad={() => setPhase((current) => (current === 'waiting' ? 'loaded' : current))}
            src={pickSrc(fallback).url}
            srcSet={buildSrcSet(fallback)}
            sizes={sizes}
            width={photo.width}
            height={photo.height}
            alt={alt}
            loading={priority ? 'eager' : loading}
            decoding="async"
            fetchPriority={priority ? 'high' : undefined}
            className={`h-full w-full object-cover ${IMG_CLASS[phase]}`}
          />
        </picture>
      </div>
    </div>
  )
}
