import { useState, type FormEvent } from 'react'
import { rooms, TOTAL_CAPACITY } from '../data/rooms'
import { useI18n } from '../i18n/useI18n'
import { addDays, fromISO, toISO, today } from '../lib/dates'
import { Icon } from './Icon'

// Versión provisoria: la validación y el envío por WhatsApp llegan en la etapa del formulario del hero.

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

export function BookingBar() {
  const { t } = useI18n()
  const [checkIn, setCheckIn] = useState(() => toISO(addDays(today(), 14)))
  const [checkOut, setCheckOut] = useState(() => toISO(addDays(today(), 18)))
  const [guests, setGuests] = useState('2')
  const [room, setRoom] = useState('todas')

  const minIn = toISO(today())

  const changeCheckIn = (value: string) => {
    if (!value) return
    setCheckIn(value)
    if (!checkOut || checkOut <= value) setCheckOut(toISO(addDays(fromISO(value), 1)))
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    document.getElementById('habitaciones')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <form
      onSubmit={onSubmit}
      aria-label={t('booking.formLabel')}
      className="mt-2 grid grid-cols-1 items-end gap-4 rounded-lg border border-white/60 bg-white/95 p-4 shadow-float backdrop-blur-xl sm:grid-cols-2 md:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.6fr)_minmax(0,1.3fr)_minmax(0,1fr)]"
    >
      <div className="flex flex-col gap-1">
        <Label htmlFor="check-in" icon="calendar_today">{t('booking.checkIn')}</Label>
        <input
          id="check-in"
          type="date"
          className={field}
          min={minIn}
          value={checkIn}
          onChange={(e) => changeCheckIn(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="check-out" icon="event">{t('booking.checkOut')}</Label>
        <input
          id="check-out"
          type="date"
          className={field}
          min={checkIn ? toISO(addDays(fromISO(checkIn), 1)) : minIn}
          value={checkOut}
          onChange={(e) => e.target.value && setCheckOut(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="guests" icon="group">{t('booking.guests')}</Label>
        <input
          id="guests"
          type="number"
          inputMode="numeric"
          className={field}
          min={1}
          max={TOTAL_CAPACITY}
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="suite" icon="bed">{t('booking.room')}</Label>
        <select id="suite" className={field} value={room} onChange={(e) => setRoom(e.target.value)}>
          <option value="todas">{t('booking.anyRoom')}</option>
          {rooms.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded bg-primary text-label text-canvas shadow-soft transition-colors hover:bg-primary-deep"
      >
        <Icon name="search" className="!text-[20px]" />
        {t('booking.submit')}
      </button>
    </form>
  )
}
