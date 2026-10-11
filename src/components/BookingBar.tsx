import { useRef, useState, type FormEvent } from 'react'
import { flushSync } from 'react-dom'
import { rooms, TOTAL_CAPACITY } from '../data/rooms'
import { useI18n } from '../i18n/useI18n'
import { addDays, fromISO, toISO, today } from '../lib/dates'
import { validateBooking, type BookingErrorCode, type BookingErrors, type BookingField } from '../lib/validation'
import { bookingMessage, whatsappLink } from '../lib/whatsapp'
import { Icon } from './Icon'
import { WhatsAppIcon } from './WhatsAppIcon'

// Es una CONSULTA: arma un mensaje con lo que la persona completó y abre WhatsApp. La página no verifica
// ni confirma disponibilidad: los dueños la manejan a mano y responden por ahí.

// 16 px como mínimo: con menos, iOS hace zoom al enfocar el campo.
const field =
  'h-12 w-full cursor-pointer rounded-lg border border-mortar bg-canvas px-4 text-[16px] font-semibold text-ink transition focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none aria-invalid:border-primary'

const ORDER: BookingField[] = ['checkIn', 'checkOut', 'guests']

function Label({ htmlFor, icon, children }: { htmlFor: string; icon: string; children: string }) {
  return (
    <label htmlFor={htmlFor} className="kicker flex items-center gap-1 text-ink-soft">
      <Icon name={icon} className="!text-[16px] text-secondary" />
      {children}
    </label>
  )
}

/** `aria-describedby` con los ids que existan, o nada. */
const describedBy = (...ids: (string | false | undefined)[]) => ids.filter(Boolean).join(' ') || undefined

export function BookingBar() {
  const { t, lang, formatDate } = useI18n()
  const [checkIn, setCheckIn] = useState(() => toISO(addDays(today(), 14)))
  const [checkOut, setCheckOut] = useState(() => toISO(addDays(today(), 18)))
  const [guests, setGuests] = useState('2')
  const [room, setRoom] = useState('')
  const [errors, setErrors] = useState<BookingErrors>({})
  // Enlace de la consulta ya armada: se muestra después de enviar, por si el navegador no abrió WhatsApp.
  const [sentUrl, setSentUrl] = useState<string | null>(null)
  const checkInRef = useRef<HTMLInputElement>(null)
  const checkOutRef = useRef<HTMLInputElement>(null)
  const guestsRef = useRef<HTMLInputElement>(null)
  const refs = { checkIn: checkInRef, checkOut: checkOutRef, guests: guestsRef }

  const minIn = toISO(today())

  /** Al corregir un campo se borra su error (y el aviso de envío, que ya quedó viejo). */
  const edited = (...fields: BookingField[]) => {
    setErrors((prev) => ({ ...prev, ...Object.fromEntries(fields.map((f) => [f, undefined])) }))
    setSentUrl(null)
  }

  const changeCheckIn = (value: string) => {
    if (!value) return
    setCheckIn(value)
    if (!checkOut || checkOut <= value) setCheckOut(toISO(addDays(fromISO(value), 1)))
    edited('checkIn', 'checkOut')
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    // «Hoy» se calcula al enviar (hora local), no al cargar la página: la pestaña pudo quedar abierta de un día para otro.
    const found = validateBooking({ checkIn, checkOut, guests }, toISO(today()), TOTAL_CAPACITY)
    // flushSync: los errores ya están en el DOM (con `aria-invalid`) cuando el foco llega al campo.
    flushSync(() => setErrors(found))
    const first = ORDER.find((f) => found[f])
    if (first) {
      setSentUrl(null)
      refs[first].current?.focus()
      return
    }
    const roomName = rooms.find((r) => r.id === room)?.name
    const url = whatsappLink(bookingMessage(t, lang, { checkIn, checkOut, guests: Number(guests), room: roomName }))
    // Con `noopener` el navegador devuelve siempre `null`: no se puede saber si lo bloqueó. Por eso, el enlace.
    window.open(url, '_blank', 'noopener,noreferrer')
    setSentUrl(url)
  }

  const error = (id: string, code?: BookingErrorCode) => (
    // La región existe siempre (vacía) para que los lectores de pantalla anuncien el error cuando aparece.
    <div aria-live="polite">
      {code && (
        <p id={id} className="flex items-start gap-1 text-small font-semibold text-primary-deep">
          <Icon name="error" className="!text-[16px] leading-5" />
          {t(`booking.error.${code}`, { max: TOTAL_CAPACITY })}
        </p>
      )}
    </div>
  )

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-label={t('booking.formLabel')}
      className="mt-2 rounded-lg border border-white/60 bg-white/95 p-4 shadow-float backdrop-blur-xl md:p-6"
    >
      <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.6fr)_minmax(0,1.3fr)] xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.6fr)_minmax(0,1.3fr)_auto]">
        <div className="flex flex-col gap-1">
          <Label htmlFor="check-in" icon="calendar_today">{t('booking.checkIn')}</Label>
          <input
            ref={checkInRef}
            id="check-in"
            type="date"
            className={field}
            min={minIn}
            value={checkIn}
            onChange={(e) => changeCheckIn(e.target.value)}
            required
            aria-invalid={errors.checkIn ? true : undefined}
            aria-describedby={describedBy(checkIn && 'check-in-long', errors.checkIn && 'check-in-error')}
          />
          {/* El selector de fecha usa el formato del navegador (dd/mm o mm/dd): acá se ve la fecha sin ambigüedad. */}
          <p id="check-in-long" className="text-small text-ink-soft">{checkIn && formatDate(checkIn)}</p>
          {error('check-in-error', errors.checkIn)}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="check-out" icon="event">{t('booking.checkOut')}</Label>
          <input
            ref={checkOutRef}
            id="check-out"
            type="date"
            className={field}
            min={checkIn ? toISO(addDays(fromISO(checkIn), 1)) : minIn}
            value={checkOut}
            onChange={(e) => {
              if (e.target.value) setCheckOut(e.target.value)
              edited('checkOut')
            }}
            required
            aria-invalid={errors.checkOut ? true : undefined}
            aria-describedby={describedBy(checkOut && 'check-out-long', errors.checkOut && 'check-out-error')}
          />
          <p id="check-out-long" className="text-small text-ink-soft">{checkOut && formatDate(checkOut)}</p>
          {error('check-out-error', errors.checkOut)}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="guests" icon="group">{t('booking.guests')}</Label>
          <input
            ref={guestsRef}
            id="guests"
            type="number"
            inputMode="numeric"
            className={field}
            min={1}
            max={TOTAL_CAPACITY}
            value={guests}
            onChange={(e) => {
              setGuests(e.target.value)
              edited('guests')
            }}
            required
            aria-invalid={errors.guests ? true : undefined}
            aria-describedby={describedBy(errors.guests && 'guests-error')}
          />
          {error('guests-error', errors.guests)}
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="room" icon="bed">{t('booking.room')}</Label>
          <select
            id="room"
            className={field}
            value={room}
            onChange={(e) => {
              setRoom(e.target.value)
              setSentUrl(null)
            }}
          >
            <option value="">{t('booking.anyRoom')}</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1 sm:col-span-2 lg:col-span-4 xl:col-span-1">
          {/* Del ancho de una etiqueta, para que el botón quede a la altura de los campos cuando va en la misma fila. */}
          <span aria-hidden="true" className="kicker invisible hidden xl:block">&nbsp;</span>
          <button
            type="submit"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded bg-primary px-6 text-label whitespace-nowrap text-canvas shadow-soft transition-colors hover:bg-primary-deep"
          >
            <WhatsAppIcon className="h-5 w-5" />
            {t('booking.submit')}
          </button>
        </div>
      </div>

      {/* Región de estado: anuncia el aviso cuando aparece. El mensaje se manda recién cuando la persona toca Enviar en WhatsApp. */}
      <div role="status">
        {sentUrl && (
          <div className="mt-3 flex flex-col items-start text-body text-ink-soft">
            <p>{t('booking.opened')}</p>
            <a
              href={sentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-2 hover:text-primary-deep"
            >
              {t('booking.openedFallback')}
            </a>
          </div>
        )}
      </div>
    </form>
  )
}
