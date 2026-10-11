import { contact, rating, reviews } from '../data/site'
import { Icon } from './Icon'

const TONE = {
  secondary: 'bg-blush text-secondary-deep',
  primary: 'bg-[#ffdada] text-primary-deep',
  tertiary: 'bg-sage text-tertiary',
} as const

export function Reviews() {
  return (
    <section id="airbnb-resenas" aria-labelledby="reviews-title" className="w-full bg-sand py-16 lg:py-24">
      <div className="container-site flex flex-col gap-12">
        <div className="flex flex-col items-center justify-between gap-6 rounded-xl border border-mortar bg-white p-6 shadow-soft md:flex-row md:p-10">
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon name="hotel_class" className="!text-[44px]" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-display text-headline-sm font-bold text-primary">{rating.score}</span>
                <span className="text-lg text-secondary" aria-label="5 estrellas">★★★★★</span>
                <span className="text-small font-medium text-ink-soft">({rating.reviews} eval.)</span>
              </div>
              <h2 id="reviews-title" className="font-sans text-xl leading-7 font-semibold text-ink">
                Superhost Airbnb · Favorito entre Huéspedes
              </h2>
              <p className="text-small text-ink-soft">
                Ubicado en el 1% de alojamientos mejor valorados de Salta.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center justify-center gap-3">
            <a
              href="#contacto"
              className="rounded bg-primary px-6 py-3 text-label text-canvas shadow-soft transition-colors hover:bg-primary-deep"
            >
              Reservar Directo (Tarifa Preferencial)
            </a>
            <a
              href={contact.airbnbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded bg-sand px-6 py-3 text-label text-ink transition-colors hover:bg-mortar"
            >
              Ver en Airbnb
              <Icon name="open_in_new" className="!text-[16px]" />
            </a>
          </div>
        </div>

        <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {reviews.map((r) => (
            <li
              key={r.name}
              className="flex flex-col justify-between gap-4 rounded-xl border border-mortar bg-white p-6 shadow-soft"
            >
              <figure className="flex flex-col gap-3">
                <figcaption className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[14px] font-bold ${TONE[r.tone]}`}
                      aria-hidden="true"
                    >
                      {r.initials}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[16px] font-semibold text-ink">{r.name}</span>
                      <span className="text-small text-ink-soft">{r.origin}</span>
                    </div>
                  </div>
                  <span className="shrink-0 text-overline font-bold text-secondary-deep">5.0 ★</span>
                </figcaption>
                <blockquote className="text-body text-ink italic">“{r.text}”</blockquote>
              </figure>
              <div className="flex items-center justify-between gap-2 border-t border-mortar pt-3 text-overline font-semibold text-ink-soft">
                <span>{r.room}</span>
                <span className="flex items-center gap-1">
                  <Icon name="check_circle" className="!text-[14px] text-tertiary" /> Airbnb Verificada
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
