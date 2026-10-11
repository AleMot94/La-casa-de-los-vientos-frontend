import { heroImage, highlights } from '../data/site'
import type { Stay } from '../lib/stay'
import { BookingBar } from './BookingBar'
import { Icon } from './Icon'

interface HeroProps {
  stay: Stay
  onStayChange: (stay: Stay) => void
}

const pill =
  'inline-flex items-center gap-1 rounded-full px-4 py-1 text-overline font-bold uppercase tracking-[0.1em] shadow-soft backdrop-blur-md'

export function Hero({ stay, onStayChange }: HeroProps) {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative w-full overflow-hidden bg-sand">
      <div className="relative flex min-h-[92vh] w-full items-end overflow-hidden pt-36 pb-12 lg:pb-16">
        <img src={heroImage} alt="" className="absolute inset-0 h-full w-full scale-105 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-canvas from-10% via-canvas/75 via-50% to-black/20" />
        <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />

        <div className="container-site relative z-10 flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`${pill} bg-sand/90 text-primary`}>
              <Icon name="explore" className="!text-[16px] text-secondary" />
              Valles Calchaquíes · Salta, Argentina
            </span>
            <span className={`${pill} bg-white/90 text-ink`}>
              <Icon name="star" className="!text-[16px] text-secondary" />
              Calificación 4.98 · Superhost Airbnb
            </span>
          </div>

          <div className="flex max-w-4xl flex-col gap-3">
            <h1
              id="hero-title"
              className="font-display text-display-sm md:text-display leading-[1.08] tracking-tight text-primary"
            >
              El Refugio Auténtico de los Valles Calchaquíes
            </h1>
            <p className="max-w-2xl text-lead text-ink">
              Una estancia boutique de adobe centenario, muros encalados y cielorrasos de cardón.
              Entre viñedos de altura, silencios de montaña y el fuego encendido al caer la tarde.
            </p>
          </div>

          <BookingBar stay={stay} onChange={onStayChange} />
        </div>
      </div>

      <div className="w-full bg-sand py-4">
        <ul className="container-site grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((h) => (
            <li key={h.title} className="flex items-center gap-3 p-1">
              <Icon name={h.icon} className="!text-[26px] text-secondary" />
              <div className="flex flex-col">
                <span className="text-[16px] font-semibold text-ink">{h.title}</span>
                <span className="text-small text-ink-soft">{h.text}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
