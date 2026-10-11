import { getPhoto } from '../data/photos'
import { buildSrcSet, fallbackFiles, pickSrc } from '../lib/photo'
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
  ratio: PhotoRatio
  className?: string
}

/** Bloque neutro con la proporción exacta: ocupa el lugar de una foto que todavía no existe. */
export function PhotoPlaceholder({ id, ratio, className = '' }: PlaceholderProps) {
  return (
    <div aria-hidden="true" className={`w-full overflow-hidden bg-mortar ${RATIO[ratio]} ${className}`}>
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
  /** Id de la foto, ej. `rooms/01-sonqoy/01`. Sus datos salen de `src/data/photos.ts`. */
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
  /** Imagen de reemplazo mientras la foto no exista (ej. el SVG de la hero). */
  fallbackSrc?: string
  className?: string
}

/**
 * Foto con proporción fija. Si el backend ya la entregó (`getPhoto`), arma un `<picture>` con AVIF y
 * WebP y el `srcset`/`sizes`; si no, muestra el placeholder (o la imagen de reemplazo).
 * El contenedor mantiene su proporción, así el layout no salta cuando llega la foto. No define su propia
 * posición: quien lo usa puede pasarle `absolute inset-0` (la hero) sin que choquen las clases.
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
  const photo = getPhoto(id)
  const fallback = photo ? fallbackFiles(photo) : undefined

  if (!photo || !fallback) {
    if (fallbackSrc) {
      return (
        <div className={`overflow-hidden ${ratio ? RATIO[ratio] : ''} ${className}`}>
          <img src={fallbackSrc} alt={alt} className="h-full w-full object-cover" />
        </div>
      )
    }
    return <PhotoPlaceholder id={id} ratio={ratio ?? '4/3'} className={className} />
  }

  // El navegador usa el primer <source> que entiende (AVIF); si no, el <img>, que es WebP (o JPEG).
  const { avif } = photo.files
  return (
    <div className={`overflow-hidden ${ratio ? RATIO[ratio] : ''} ${className}`}>
      <picture className="block h-full w-full">
        {avif && avif.length > 0 && fallback !== avif && (
          <source type="image/avif" srcSet={buildSrcSet(avif)} sizes={sizes} />
        )}
        <img
          src={pickSrc(fallback).url}
          srcSet={buildSrcSet(fallback)}
          sizes={sizes}
          width={photo.width}
          height={photo.height}
          alt={alt}
          loading={priority ? 'eager' : loading}
          decoding="async"
          fetchPriority={priority ? 'high' : undefined}
          className="h-full w-full object-cover"
        />
      </picture>
    </div>
  )
}
