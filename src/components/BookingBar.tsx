import type { FormEvent } from 'react'
import { guestOptions, rooms, wholeHouseOption } from '../data/site'
import { addDays, fromISO, toISO, today } from '../lib/dates'
import type { Stay } from '../lib/stay'
import { Icon } from './Icon'

interface BookingBarProps {
  stay: Stay
  onChange: (stay: Stay) => void
}

const field =
  'h-12 w-full cursor-pointer rounded-lg border border-mortar bg-canvas px-4 text-[15px] font-semibold text-ink transition focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none'

function Label({ htmlFor, icon, children }: { htmlFor: string; icon: string; children: string }) {
  return (
    <label htmlFor={htmlFor} className="kicker flex items-center gap-1 text-ink-soft">
      <Icon name={icon} className="!text-[16px] text-secondary" />
      {children}
    </label>
  )
}

export function BookingBar({ stay, onChange }: BookingBarProps) {
  const minIn = toISO(today())

  const setCheckIn = (value: string) => {
    if (!value) return
    const next = { ...stay, checkIn: value }
    if (!stay.checkOut || stay.checkOut <= value) next.checkOut = toISO(addDays(fromISO(value), 1))
    onChange(next)
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    document.getElementById('habitaciones')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <form
      onSubmit={onSubmit}
      aria-label="Consultar disponibilidad"
      className="mt-2 grid grid-cols-1 items-end gap-4 rounded-lg border border-white/60 bg-white/95 p-4 shadow-float backdrop-blur-xl sm:grid-cols-2 md:p-6 lg:grid-cols-5"
    >
      <div className="flex flex-col gap-1">
        <Label htmlFor="check-in" icon="calendar_today">Llegada</Label>
        <input
          id="check-in"
          type="date"
          className={field}
          min={minIn}
          value={stay.checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="check-out" icon="event">Salida</Label>
        <input
          id="check-out"
          type="date"
          className={field}
          min={stay.checkIn ? toISO(addDays(fromISO(stay.checkIn), 1)) : minIn}
          value={stay.checkOut}
          onChange={(e) => e.target.value && onChange({ ...stay, checkOut: e.target.value })}
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="guests" icon="group">Huéspedes</Label>
        <select
          id="guests"
          className={field}
          value={stay.guests}
          onChange={(e) => onChange({ ...stay, guests: Number(e.target.value) })}
        >
          {guestOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="suite" icon="bed">Habitación</Label>
        <select
          id="suite"
          className={field}
          value={stay.room}
          onChange={(e) => onChange({ ...stay, room: e.target.value as Stay['room'] })}
        >
          <option value="todas">Cualquiera disponible</option>
          {rooms.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
          <option value="casona">{wholeHouseOption}</option>
        </select>
      </div>
      <button
        type="submit"
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded bg-primary text-label text-canvas shadow-soft transition-colors hover:bg-primary-deep"
      >
        <Icon name="search" className="!text-[20px]" />
        Ver Disponibilidad
      </button>
    </form>
  )
}
