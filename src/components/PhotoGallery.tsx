import { useState } from 'react'
import { useI18n } from '../i18n/useI18n'
import { usePhotos } from '../photos/usePhotos'
import { Icon } from './Icon'
import { Photo, PhotoPlaceholder, type PhotoRatio } from './Photo'
import { PhotoLightbox } from './PhotoLightbox'

interface PhotoGalleryProps {
  /** Carpeta de las fotos (`rooms/01-sonqoy`): se muestran todas las numeradas que el backend entregó, en orden. */
  folder: string
  /** Nombre del lugar (habitación o instalación): arma el texto alternativo y la etiqueta. */
  name: string
  ratio: PhotoRatio
  /** Cuánto ocupa la foto de la tarjeta en pantalla (ver `Photo`). */
  sizes: string
  className?: string
}

/**
 * Fotos de una habitación o instalación, tantas como entregue el backend para su carpeta. Sin fotos, el
 * placeholder. Con fotos, la tarjeta muestra solo la primera; al tocarla se abre la galería a pantalla
 * completa (`PhotoLightbox`) para pasar de una foto a otra.
 */
export function PhotoGallery({ folder, name, ratio, sizes, className = '' }: PhotoGalleryProps) {
  const { t } = useI18n()
  const { status, idsIn } = usePhotos()
  const ids = idsIn(folder)
  const [open, setOpen] = useState(false)
  const alt = (id: string) => t('photo.alt', { name, n: ids.indexOf(id) + 1 })

  if (ids.length === 0) {
    return <PhotoPlaceholder id={`${folder}/01`} ratio={ratio} pulsing={status === 'loading'} className={className} />
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-label={t('gallery.open', { name })}
        onClick={() => setOpen(true)}
        className="group relative block w-full cursor-zoom-in focus-visible:outline-offset-[-3px]"
      >
        <Photo
          id={ids[0]}
          alt={alt(ids[0])}
          ratio={ratio}
          sizes={sizes}
          className="transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-3 bottom-3 flex items-center gap-1.5 rounded-full bg-ink/60 px-3 py-1 text-overline font-bold text-canvas"
        >
          <Icon name={ids.length > 1 ? 'photo_library' : 'fullscreen'} className="!text-[16px]" />
          {ids.length > 1 && ids.length}
        </span>
      </button>

      {open && <PhotoLightbox ids={ids} name={name} alt={alt} onClose={() => setOpen(false)} />}
    </div>
  )
}
