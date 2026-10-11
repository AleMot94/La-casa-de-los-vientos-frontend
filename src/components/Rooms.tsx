import { isOccupied, rooms, type Room } from '../data/site'
import { addDays, today } from '../lib/dates'
import type { Stay } from '../lib/stay'
import { AvailabilityCalendar } from './AvailabilityCalendar'
import { Icon } from './Icon'
import { SectionHeading } from './SectionHeading'

export interface BookingRequest {
  roomId: Room['id']
  checkIn: string
  checkOut: string
}

interface RoomsProps {
  stay: Stay
  onStayChange: (stay: Stay) => void
  onRequest: (request: BookingRequest) => void
}

const chip = 'rounded-md bg-mortar px-3 py-0.5 text-overline font-bold tracking-[0.06em] text-ink'

function freeNights(roomId: Room['id']): number {
  const start = today()
  let free = 0
  for (let i = 0; i < 30; i++) if (!isOccupied(roomId, addDays(start, i))) free++
  return free
}

export function Rooms({ stay, onStayChange, onRequest }: RoomsProps) {
  const [featured, ...others] = rooms
  const selected = (id: Room['id']) => stay.room === id

  return (
    <section id="habitaciones" aria-labelledby="rooms-title" className="w-full bg-canvas py-16 lg:py-24">
      <div className="container-site flex flex-col gap-12">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <SectionHeading
            id="rooms-title"
            className="max-w-2xl"
            overline="Habitaciones & Suites Coloniales"
            title="Descanso profundo en sintonía con la tierra"
          >
            Sin pasarela de pago obligatoria: consultá las fechas en el calendario y confirmá directamente
            con nuestro concierge para obtener la{' '}
            <strong className="font-semibold text-ink">mejor tarifa garantizada</strong>.
          </SectionHeading>
          <div className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-sand px-4 py-2">
            <Icon name="lock_reset" className="!text-[20px] text-primary" />
            <span className="text-small text-ink">Reserva directa · Sin comisiones ocultas</span>
          </div>
        </div>

        <article
          className={`flex flex-col overflow-hidden rounded-xl border bg-white shadow-float lg:flex-row ${
            selected(featured.id) ? 'border-primary' : 'border-mortar'
          }`}
        >
          <div className="relative min-h-96 lg:w-7/12">
            <img src={featured.image} alt={featured.alt} className="absolute inset-0 h-full w-full object-cover" />
            <span className="kicker absolute top-4 left-4 rounded-full bg-primary px-4 py-1 text-canvas shadow-soft">
              {featured.badge}
            </span>
            <div className="absolute inset-x-4 bottom-4 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-canvas/90 p-3 backdrop-blur-md">
              <span className="flex items-center gap-1 text-small text-ink">
                <Icon name="fireplace" className="!text-[18px] text-secondary" /> Hogar en suite
              </span>
              <span className="flex items-center gap-1 text-small text-ink">
                <Icon name="bathtub" className="!text-[18px] text-secondary" /> Tina en piedra
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6 bg-[#fcf6ee] p-6 lg:w-5/12">
            <div className="flex flex-col gap-3">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-card text-primary">{featured.name}</h3>
                <div className="shrink-0 text-right">
                  <span className="text-xl font-bold text-primary">USD ${featured.priceUsd}</span>
                  <span className="block text-small text-ink-soft">{featured.priceNote}</span>
                </div>
              </div>
              <p className="text-small text-ink-soft">{featured.text}</p>
              <ul className="flex flex-wrap gap-2 pt-1">
                {featured.chips.map((c) => (
                  <li key={c} className={chip}>{c}</li>
                ))}
              </ul>
              <div className="mt-2">
                <AvailabilityCalendar
                  roomId={featured.id}
                  checkIn={stay.checkIn}
                  checkOut={stay.checkOut}
                  onChange={(checkIn, checkOut) => onStayChange({ ...stay, checkIn, checkOut })}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => onRequest({ roomId: featured.id, checkIn: stay.checkIn, checkOut: stay.checkOut })}
              className="flex h-12 w-full items-center justify-center gap-2 rounded bg-primary text-label text-canvas shadow-soft transition-colors hover:bg-primary-deep"
            >
              <Icon name="send" className="!text-[18px]" />
              Solicitar Reserva para {featured.shortName}
            </button>
          </div>
        </article>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {others.map((room) => {
            const free = freeNights(room.id)
            return (
              <article
                key={room.id}
                className={`flex flex-col overflow-hidden rounded-xl border bg-white shadow-soft ${
                  selected(room.id) ? 'border-primary' : 'border-mortar'
                }`}
              >
                <div className="relative aspect-[16/10] bg-sand">
                  <img src={room.image} alt={room.alt} loading="lazy" className="h-full w-full object-cover" />
                  <span
                    className={`kicker absolute top-4 left-4 rounded-full px-4 py-1 shadow-soft ${
                      room.id === 'quebrada' ? 'bg-tertiary text-canvas' : 'bg-secondary-deep text-canvas'
                    }`}
                  >
                    {room.badge}
                  </span>
                </div>
                <div className="flex grow flex-col justify-between gap-4 p-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-display text-card text-primary">{room.name}</h3>
                      <div className="shrink-0 text-right">
                        <span className="text-xl font-bold text-primary">USD ${room.priceUsd}</span>
                        <span className="block text-small text-ink-soft">{room.priceNote}</span>
                      </div>
                    </div>
                    <p className="text-small text-ink-soft">{room.text}</p>
                    <ul className="flex flex-wrap gap-2">
                      {room.chips.map((c) => (
                        <li key={c} className={chip}>{c}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-lg bg-[#fcf6ee] p-3">
                    <span className="flex items-center gap-2 text-small font-semibold text-ink">
                      <Icon name="calendar_today" className="!text-[20px] text-secondary" />
                      Disponibilidad próximos 30 días
                    </span>
                    <span className="shrink-0 rounded bg-sage px-3 py-1 text-overline font-bold text-tertiary">
                      {free <= 5 ? 'Últimos cupos' : `${free} noches libres`}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRequest({ roomId: room.id, checkIn: stay.checkIn, checkOut: stay.checkOut })}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded bg-mortar text-label text-primary transition-colors hover:bg-primary hover:text-canvas"
                  >
                    <Icon name="chat" className="!text-[18px]" />
                    Consultar {room.shortName}
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
