import heroImage from '../assets/img/hero.svg'
import { siteConfig } from '../data/siteConfig'
import { useI18n } from '../i18n/useI18n'
import { BookingBar } from './BookingBar'
import { Icon } from './Icon'
import { Photo } from './Photo'

const pill =
  'inline-flex items-center gap-1 rounded-full px-4 py-1 text-overline font-bold uppercase tracking-[0.1em] shadow-soft backdrop-blur-md'

const { locality, province } = siteConfig.location

export function Hero() {
  const { t } = useI18n()

  const highlights = [
    { icon: 'bakery_dining', title: t('highlight.breakfast.title'), text: t('highlight.breakfast.text') },
    { icon: 'family_home', title: t('highlight.family.title'), text: t('highlight.family.text') },
  ]

  return (
    <section id="inicio" aria-labelledby="hero-title" className="relative w-full overflow-hidden bg-sand">
      <div className="relative flex min-h-[92vh] w-full items-end overflow-hidden pt-36 pb-12 lg:pb-16">
        {/* Foto `hero` del backend; mientras no exista, el SVG de ejemplo. Es la imagen principal: se pide ya. */}
        <Photo
          id="hero"
          alt=""
          priority
          sizes="100vw"
          fallbackSrc={heroImage}
          className="absolute inset-0 h-full w-full scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-canvas from-10% via-canvas/75 via-50% to-black/20" />
        <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />

        <div className="container-site relative z-10 flex w-full flex-col gap-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`${pill} bg-sand/90 text-primary`}>
              <Icon name="explore" className="!text-[16px] text-secondary" />
              {t('hero.location', { locality, province })}
            </span>
          </div>

          <div className="flex max-w-4xl flex-col gap-3">
            <h1
              id="hero-title"
              className="font-display text-display-sm md:text-display leading-[1.08] tracking-tight text-primary"
            >
              {t('hero.title')}
            </h1>
            <p className="max-w-2xl text-lead text-ink">{t('hero.lead')}</p>
          </div>

          <BookingBar />
        </div>
      </div>

      <div className="w-full bg-sand py-4">
        <div className="container-site">
          <ul className="mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
            {highlights.map((h) => (
              <li key={h.icon} className="flex items-center gap-3 p-1 sm:justify-center">
                <Icon name={h.icon} className="!text-[26px] text-secondary" />
                <div className="flex flex-col">
                  <span className="text-[16px] font-semibold text-ink">{h.title}</span>
                  <span className="text-small text-ink-soft">{h.text}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
