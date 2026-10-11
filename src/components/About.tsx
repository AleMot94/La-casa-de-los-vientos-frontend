import { rooms, TOTAL_CAPACITY } from '../data/rooms'
import { siteConfig } from '../data/siteConfig'
import { useI18n } from '../i18n/useI18n'
import { Icon } from './Icon'
import { Photo } from './Photo'
import { SectionHeading } from './SectionHeading'

// Cuánto ocupa la foto en pantalla: ancho de la columna (5 de 12) desde 1024 px, todo el ancho antes.
const ABOUT_SIZES = '(min-width: 1024px) 476px, calc(100vw - 2.5rem)'

export function About() {
  const { t } = useI18n()

  // Los números salen de los datos de las habitaciones, no se escriben a mano.
  const stats = [
    { value: rooms.length, title: t('about.stat.rooms.title'), text: t('about.stat.rooms.text'), accent: 'primary' },
    { value: TOTAL_CAPACITY, title: t('about.stat.people.title'), text: t('about.stat.people.text'), accent: 'secondary' },
  ]

  return (
    <section id="conocenos" aria-labelledby="about-title" className="w-full bg-canvas py-16 lg:py-24">
      <div className="container-site grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-7">
          <SectionHeading id="about-title" overline={t('about.overline')} title={t('about.title')} />

          <div className="flex flex-col gap-4 text-lead text-ink">
            <p>
              {t('about.p1.before')}
              <strong className="font-semibold">{siteConfig.name}</strong>
              {t('about.p1.after')}
            </p>
            <p className="text-body text-ink-soft">{t('about.p2')}</p>
          </div>

          <ul className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
            {stats.map((s) => (
              <li key={s.title} className="flex flex-col gap-1 rounded-lg border border-mortar bg-sand p-4">
                <span
                  className={`font-display text-[2.375rem] leading-tight ${
                    s.accent === 'secondary' ? 'text-secondary' : 'text-primary'
                  }`}
                >
                  {s.value}
                </span>
                <span className="text-[16px] font-semibold text-ink">{s.title}</span>
                <span className="text-small text-ink-soft">{s.text}</span>
              </li>
            ))}
          </ul>

          <figure className="flex items-center gap-4 rounded-lg bg-sand p-4">
            <Icon name="format_quote" className="!text-[32px] shrink-0 text-primary" />
            <blockquote className="text-small text-ink italic">{t('about.quote', { name: siteConfig.name })}</blockquote>
          </figure>
        </div>

        <div className="relative flex flex-col gap-4 lg:col-span-5">
          <div className="relative overflow-hidden rounded-xl shadow-float">
            <Photo id="about/01" alt={siteConfig.name} ratio="4/5" sizes={ABOUT_SIZES} />
            <div className="absolute inset-x-4 bottom-10 flex items-center justify-between rounded-lg bg-white/90 p-4 shadow-soft backdrop-blur-md">
              <div>
                <h3 className="font-sans text-[16px] font-semibold text-primary">{t('about.caption.title')}</h3>
                <p className="text-small text-ink-soft">{t('about.caption.text')}</p>
              </div>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon name="local_cafe" className="!text-[20px]" />
              </span>
            </div>
          </div>

          <div className="relative z-10 -mt-10 mx-4 flex items-center gap-3 rounded-lg bg-primary p-4 text-canvas shadow-float">
            <span className="flex items-center gap-2 text-label">
              <Icon name="verified_user" className="!text-[24px] shrink-0 text-blush" />
              {t('about.eco')}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
