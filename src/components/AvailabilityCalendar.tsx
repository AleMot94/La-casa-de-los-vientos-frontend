import { useId, useState } from 'react'
import { isOccupied, type Room } from '../data/site'
import { addDays, formatShort, fromISO, monthName, nightsBetween, pad, today, toISO } from '../lib/dates'
import { Icon } from './Icon'

interface AvailabilityCalendarProps {
  roomId: Room['id']
  checkIn: string
  checkOut: string
  onChange: (checkIn: string, checkOut: string) => void
}

const WEEKDAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

/** ¿Hay alguna noche ocupada entre `from` (inclusive) y `to` (exclusive)? */
function hasOccupiedNight(roomId: Room['id'], from: string, to: string): boolean {
  for (let d = fromISO(from); toISO(d) < to; d = addDays(d, 1)) {
    if (isOccupied(roomId, d)) return true
  }
  return false
}

export function AvailabilityCalendar({ roomId, checkIn, checkOut, onChange }: AvailabilityCalendarProps) {
  const base = checkIn ? fromISO(checkIn) : today()
  const [view, setView] = useState({ year: base.getFullYear(), month: base.getMonth() })
  const titleId = useId()
  const now = today()
  const nowISO = toISO(now)

  const first = new Date(view.year, view.month, 1)
  const offset = (first.getDay() + 6) % 7
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate()
  const atCurrentMonth = view.year === now.getFullYear() && view.month === now.getMonth()

  const shift = (delta: number) => {
    const d = new Date(view.year, view.month + delta, 1)
    setView({ year: d.getFullYear(), month: d.getMonth() })
  }

  const pick = (iso: string) => {
    const selectingEnd = checkIn && !checkOut && iso > checkIn && !hasOccupiedNight(roomId, checkIn, iso)
    if (selectingEnd) onChange(checkIn, iso)
    else onChange(iso, '')
  }

  const nights = nightsBetween(checkIn, checkOut)

  return (
    <div className="rounded-lg border border-mortar bg-white p-3 shadow-soft">
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => shift(-1)}
            disabled={atCurrentMonth}
            aria-label="Mes anterior"
            className="flex h-8 w-8 items-center justify-center rounded text-primary transition-colors hover:bg-sand disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <Icon name="chevron_left" className="!text-[20px]" />
          </button>
          <span id={titleId} className="min-w-28 text-center text-label font-bold text-ink" aria-live="polite">
            {monthName(view.month)} {view.year}
          </span>
          <button
            type="button"
            onClick={() => shift(1)}
            aria-label="Mes siguiente"
            className="flex h-8 w-8 items-center justify-center rounded text-primary transition-colors hover:bg-sand"
          >
            <Icon name="chevron_right" className="!text-[20px]" />
          </button>
        </div>
        <div className="hidden items-center gap-3 text-overline font-semibold text-ink-soft sm:flex">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-tertiary" /> Libre
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-primary/40" /> Ocupado
          </span>
        </div>
      </div>

      <div role="grid" aria-labelledby={titleId} className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((d) => (
          <span key={d} role="columnheader" className="py-1 text-overline font-bold text-ink-soft">
            {d}
          </span>
        ))}
        {Array.from({ length: offset }, (_, i) => (
          <span key={`o${i}`} role="gridcell" />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1
          const date = new Date(view.year, view.month, day)
          const iso = `${view.year}-${pad(view.month + 1)}-${pad(day)}`
          const past = iso < nowISO
          const occupied = !past && isOccupied(roomId, date)
          // Una salida puede caer en un día ocupado: solo bloquea la noche.
          const asCheckout = Boolean(checkIn) && !checkOut && iso > checkIn && !hasOccupiedNight(roomId, checkIn, iso)
          const disabled = past || (occupied && !asCheckout)
          const isStart = iso === checkIn
          const isEnd = iso === checkOut
          const inRange = Boolean(checkIn && checkOut) && iso > checkIn && iso < checkOut

          let style = 'text-tertiary font-semibold hover:bg-sage'
          if (disabled) style = `cursor-not-allowed text-ink-soft/40 ${occupied ? 'line-through' : ''}`
          if (inRange) style = 'bg-secondary/20 text-ink font-semibold'
          if (isStart || isEnd) style = 'bg-primary text-canvas font-bold'

          return (
            <button
              key={iso}
              type="button"
              role="gridcell"
              disabled={disabled}
              onClick={() => pick(iso)}
              aria-pressed={isStart || isEnd || inRange}
              aria-label={`${day} de ${monthName(view.month)}${occupied ? ', ocupado' : past ? ', fecha pasada' : ''}`}
              className={`h-9 rounded text-small transition-colors ${style}`}
            >
              {day}
            </button>
          )
        })}
      </div>

      <p className="pt-2 text-center text-overline font-semibold text-ink-soft" aria-live="polite">
        {checkIn && checkOut
          ? `${formatShort(checkIn)} → ${formatShort(checkOut)} (${nights} ${nights === 1 ? 'noche' : 'noches'})`
          : checkIn
            ? `Llegada ${formatShort(checkIn)}. Elegí el día de salida.`
            : 'Elegí tu día de llegada.'}
      </p>
    </div>
  )
}
