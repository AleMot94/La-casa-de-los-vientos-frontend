import { aboutImage, brand, stats } from '../data/site'
import { Icon } from './Icon'
import { SectionHeading } from './SectionHeading'

export function About() {
  return (
    <section id="la-hosteria" aria-labelledby="about-title" className="w-full bg-canvas py-16 lg:py-24">
      <div className="container-site grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-7">
          <SectionHeading
            id="about-title"
            overline="Patrimonio Calchaquí & Raigambre"
            title="Donde el viento del cerro susurra la historia de la casona"
          />

          <div className="flex flex-col gap-4 text-lead text-ink">
            <p>
              Emplazada sobre un antiguo sendero arriero que unía los valles con la puna,{' '}
              <strong className="font-semibold">{brand.name}</strong> conserva la arquitectura sobria y
              térmica del adobe amasado con paja de las vegas altas. Su emblema rinde tributo a la
              histórica veleta de hierro forjado que desde el siglo XIX orientaba a los caminantes según
              los caprichos del viento zonda.
            </p>
            <p className="text-body text-ink-soft">
              Cada rincón ha sido intervenido con respeto patrimonial: tirantes macizos de cardón
              rescatados, pisos cocidos a horno de leña, mantas tejidas en telar criollo por artesanos de
              Seclantás y una quietud ininterrumpida que solo el Norte Argentino puede brindar.
            </p>
          </div>

          <ul className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-3">
            {stats.map((s) => (
              <li key={s.title} className="flex flex-col gap-1 rounded-lg border border-mortar bg-sand p-4">
                <span
                  className={`font-display text-[2.375rem] leading-tight ${
                    s.accent === 'secondary' ? 'text-secondary' : 'text-primary'
                  }`}
                >
                  {s.value}
                  {s.unit && (
                    <span className={`text-card ${s.accent === 'secondary' ? 'text-primary' : 'text-secondary'}`}>
                      {s.unit}
                    </span>
                  )}
                </span>
                <span className="text-[16px] font-semibold text-ink">{s.title}</span>
                <span className="text-small text-ink-soft">{s.text}</span>
              </li>
            ))}
          </ul>

          <figure className="flex items-center gap-4 rounded-lg bg-sand p-4">
            <Icon name="format_quote" className="!text-[32px] shrink-0 text-primary" />
            <blockquote className="text-small text-ink italic">
              “{brand.name} no es un hotel de paso; es una pausa sagrada entre las formaciones rojizas de
              la quebrada y el perfume dulce del Torrontés.”
            </blockquote>
          </figure>
        </div>

        <div className="relative flex flex-col gap-4 lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-sand shadow-float">
            <img
              src={aboutImage}
              alt="Patio de los Jazmines, con muros de adobe y vista a los cerros colorados"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-x-4 bottom-10 flex items-center justify-between rounded-lg bg-white/90 p-4 shadow-soft backdrop-blur-md">
              <div>
                <h3 className="font-sans text-[16px] font-semibold text-primary">Patio de los Jazmines</h3>
                <p className="text-small text-ink-soft">Lugar del té andino y lectura al atardecer</p>
              </div>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon name="local_cafe" className="!text-[20px]" />
              </span>
            </div>
          </div>

          <div className="relative z-10 -mt-10 mx-4 flex items-center justify-between gap-3 rounded-lg bg-primary p-4 text-canvas shadow-float">
            <span className="flex items-center gap-2 text-label">
              <Icon name="verified_user" className="!text-[24px] shrink-0 text-blush" />
              Construcción ecológica de barro cocido
            </span>
            <span className="kicker hidden shrink-0 text-blush sm:block">Eco-Boutique</span>
          </div>
        </div>
      </div>
    </section>
  )
}
