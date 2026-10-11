import { Icon } from './Icon'

/** Proporciones permitidas. Son clases completas para que Tailwind las detecte al compilar. */
const RATIO = {
  '4/3': 'aspect-[4/3]',
  '3/2': 'aspect-[3/2]',
  '4/5': 'aspect-[4/5]',
  '16/9': 'aspect-video',
} as const

export type PhotoRatio = keyof typeof RATIO

interface PhotoProps {
  /** Id de la foto = ruta del original sin extensión, ej. `rooms/01-sonqoy/01`. */
  id: string
  /** Texto alternativo de la foto real (el placeholder es decorativo y no lo usa). */
  alt: string
  ratio: PhotoRatio
  className?: string
}

/**
 * Foto con proporción fija. Todavía no hay fotos: muestra un placeholder con la
 * proporción exacta, así el layout no salta cuando lleguen las reales.
 */
export function Photo({ id, alt: _alt, ratio, className = '' }: PhotoProps) {
  return (
    <div
      aria-hidden="true"
      className={`relative flex w-full items-center justify-center overflow-hidden bg-mortar ${RATIO[ratio]} ${className}`}
    >
      <Icon name="photo_camera" className="!text-[40px] text-ink-soft/40" />
      {import.meta.env.DEV && (
        <span className="absolute bottom-2 left-2 rounded bg-canvas/80 px-2 py-0.5 font-mono text-[10px] text-ink-soft">
          {id}
        </span>
      )}
    </div>
  )
}
