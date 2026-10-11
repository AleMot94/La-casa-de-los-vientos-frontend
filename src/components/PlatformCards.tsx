import { platforms } from '../data/platforms'
import { useI18n } from '../i18n/useI18n'
import { Icon } from './Icon'

/**
 * Tarjetas de Airbnb y Booking con un botón al anuncio. La puntuación y las reseñas son opcionales y se cargan
 * a mano en `src/data/platforms.ts` (ninguna de las dos ofrece una API pública). En producción solo aparecen
 * las plataformas que ya tienen URL; en desarrollo también las que faltan, marcadas.
 */
export function PlatformCards() {
  const { t } = useI18n()
  const visible = platforms.filter((p) => p.url || import.meta.env.DEV)
  if (visible.length === 0) return null

  return (
    <div className="flex flex-col gap-3">
      <h3 className="kicker text-ink-soft">{t('contact.platforms.title')}</h3>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {visible.map((p) => (
          <li key={p.id} className="flex flex-col justify-between gap-4 rounded-lg border border-mortar bg-sand p-4">
            <div className="flex flex-col gap-1">
              <span className="font-display text-card text-primary">{t(`contact.platforms.${p.id}`)}</span>
              {p.rating !== undefined && p.ratingScale !== undefined && (
                <span className="text-small text-ink-soft">
                  {t('contact.platforms.rating', { rating: p.rating, scale: p.ratingScale })}
                  {p.reviewCount !== undefined && ` · ${t('contact.platforms.reviews', { count: p.reviewCount })}`}
                </span>
              )}
            </div>
            {p.url ? (
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 w-fit items-center justify-center gap-2 rounded border-[1.5px] border-primary px-4 text-label text-primary transition-colors hover:bg-primary hover:text-canvas"
              >
                {t('contact.platforms.view')}
                <Icon name="open_in_new" className="!text-[18px]" />
              </a>
            ) : (
              <span className="w-fit rounded border border-dashed border-primary px-3 py-2 font-mono text-small text-ink-soft">
                TODO: platforms.ts → {p.id}.url
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
