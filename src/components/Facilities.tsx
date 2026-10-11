import type { FacilityId } from '../api/contract'
import { facilities } from '../data/facilities'
import { Photo } from './Photo'
import { SectionHeading } from './SectionHeading'

// Provisorio, solo en español: en la etapa de idiomas pasa a los diccionarios.
// TODO: los textos de cada instalación todavía no los tenemos.
const copy: Record<FacilityId, { title: string; text: string }> = {
  patios: { title: 'Patios', text: 'TODO: texto de Patios.' },
  desayunador: { title: 'Desayunador', text: 'TODO: texto de Desayunador.' },
  pileta: { title: 'Pileta', text: 'TODO: texto de Pileta.' },
  anfitriones: { title: 'Anfitriones', text: 'TODO: texto de Anfitriones.' },
}

export function Facilities() {
  return (
    <section
      id="instalaciones"
      aria-labelledby="facilities-title"
      className="w-full bg-[#fcf6ee] py-16 lg:py-24"
    >
      <div className="container-site flex flex-col gap-12 lg:gap-16">
        <SectionHeading
          id="facilities-title"
          className="max-w-lg"
          overline="Espacios de Descanso & Naturaleza"
          title="Instalaciones pensadas para reconectar"
        />

        <ul className="flex flex-col gap-12 lg:gap-16">
          {facilities.map((facility, index) => {
            const { title, text } = copy[facility.id]
            return (
              <li key={facility.id} className="grid grid-cols-1 items-center gap-6 lg:grid-cols-2 lg:gap-12">
                <div className={`flex flex-col gap-2 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <span className="kicker text-secondary-deep">{String(facility.order).padStart(2, '0')}</span>
                  <h3 className="font-display text-headline-sm text-primary">{title}</h3>
                  <p className="max-w-lg text-body text-ink-soft">{text}</p>
                </div>
                <Photo
                  id={facility.photos[0]}
                  alt={`${title}, foto 1`}
                  ratio="3/2"
                  className="rounded-xl shadow-float"
                />
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
