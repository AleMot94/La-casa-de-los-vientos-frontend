import { roomCapacity, rooms, TOTAL_CAPACITY } from '../data/rooms'
import { describeBeds, describeCapacity } from '../lib/beds'
import { Icon } from './Icon'
import { Photo } from './Photo'
import { SectionHeading } from './SectionHeading'

export function Rooms() {
  return (
    <section id="habitaciones" aria-labelledby="rooms-title" className="w-full bg-canvas py-16 lg:py-24">
      <div className="container-site flex flex-col gap-12">
        <SectionHeading
          id="rooms-title"
          className="max-w-2xl"
          overline="Habitaciones"
          title="Descanso profundo en sintonía con la tierra"
        >
          {rooms.length} habitaciones privadas, con capacidad total para {TOTAL_CAPACITY} personas.
        </SectionHeading>

        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {rooms.map((room, index) => {
            // La última (la más grande) ocupa el ancho completo para no quedar sola en la última fila de la grilla.
            const wide = index === rooms.length - 1
            return (
              <li
                key={room.id}
                className={`flex flex-col overflow-hidden rounded-xl border border-mortar bg-white shadow-soft ${
                  wide ? 'md:col-span-2 md:flex-row xl:col-span-3' : ''
                }`}
              >
                <div className={wide ? 'md:w-1/2' : ''}>
                  <Photo id={room.photos[0]} alt={`${room.name}, foto 1`} ratio="4/3" />
                </div>
                <div className={`flex flex-col gap-3 p-6 ${wide ? 'md:w-1/2 md:justify-center md:p-10' : ''}`}>
                  <span className="kicker text-secondary-deep">Habitación {room.number}</span>
                  <h3 className="font-display text-card text-primary">{room.name}</h3>
                  <p className="text-body text-ink-soft">{describeBeds(room.beds)}</p>
                  <p className="inline-flex w-fit items-center gap-2 rounded-md bg-mortar px-3 py-1 text-small font-semibold text-ink">
                    <Icon name="group" className="!text-[18px] text-secondary" />
                    {describeCapacity(roomCapacity(room))}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
