import { useState } from 'react'
import { facilities, facilityFilters, type FacilityCategory } from '../data/site'
import { Icon } from './Icon'
import { SectionHeading } from './SectionHeading'

type Filter = 'todos' | FacilityCategory

const SPAN: Record<number, string> = {
  12: 'md:col-span-12',
  7: 'md:col-span-7',
  6: 'md:col-span-6',
  5: 'md:col-span-5',
  4: 'md:col-span-4',
}

export function Facilities() {
  const [filter, setFilter] = useState<Filter>('todos')
  const visible = facilities.filter((f) => filter === 'todos' || f.category === filter)

  return (
    <section
      id="instalaciones"
      aria-labelledby="facilities-title"
      className="w-full bg-[#fcf6ee] py-16 lg:py-24"
    >
      <div className="container-site flex flex-col gap-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <SectionHeading
            id="facilities-title"
            className="max-w-lg"
            overline="Espacios de Descanso & Naturaleza"
            title="Instalaciones pensadas para reconectar"
          >
            Desde galerías sombreadas con buganvilias hasta nuestra cava soterrada donde maduran las
            mejores añadas de los valles.
          </SectionHeading>

          <div
            role="group"
            aria-label="Filtrar instalaciones"
            className="-mx-5 flex gap-1 overflow-x-auto rounded-lg bg-sand p-1 px-5 md:mx-0 md:overflow-visible md:px-1"
          >
            {facilityFilters.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={`shrink-0 rounded px-3.5 py-2 text-overline font-bold tracking-[0.1em] whitespace-nowrap uppercase transition-colors ${
                  filter === f.id
                    ? 'bg-primary text-canvas'
                    : 'text-ink-soft hover:bg-mortar hover:text-ink'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-12">
          {visible.map((f) => {
            const span = filter === 'todos' ? f.span : 12 / visible.length
            const tall = filter === 'todos' ? f.tall : visible.length < 3
            return (
              <li
                key={f.id}
                className={`group relative isolate flex flex-col justify-end overflow-hidden rounded-xl bg-sand shadow-soft ${SPAN[span] ?? 'md:col-span-6'} ${
                  tall ? 'min-h-[22rem]' : 'min-h-80'
                }`}
              >
                <img
                  src={f.image}
                  alt={f.alt}
                  loading="lazy"
                  className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="p-6 text-canvas">
                  <span className="kicker mb-1 inline-flex items-center gap-1 text-blush">
                    {f.icon && <Icon name={f.icon} className="!text-[16px]" />}
                    {f.kicker}
                  </span>
                  <h3 className="font-display text-card font-normal">{f.title}</h3>
                  <p className="mt-1 max-w-lg text-small text-canvas/85">{f.text}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
