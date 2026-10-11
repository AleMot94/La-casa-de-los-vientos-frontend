import { useEffect, useRef } from 'react'
import { brand, rooms } from '../data/site'
import { formatShort, nightsBetween } from '../lib/dates'
import type { Stay } from '../lib/stay'
import { whatsappLink } from '../lib/whatsapp'
import type { BookingRequest } from './Rooms'
import { Icon } from './Icon'

interface BookingModalProps {
  request: BookingRequest | null
  stay: Stay
  onClose: () => void
  onUseForm: () => void
}

export function BookingModal({ request, stay, onClose, onUseForm }: BookingModalProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (request && !dialog.open) {
      dialog.showModal()
      document.body.style.overflow = 'hidden'
    }
    if (!request && dialog.open) dialog.close()
    return () => {
      document.body.style.overflow = ''
    }
  }, [request])

  const room = rooms.find((r) => r.id === request?.roomId)
  const hasDates = Boolean(request?.checkIn && request?.checkOut)
  const nights = request ? nightsBetween(request.checkIn, request.checkOut) : 0
  const dates = hasDates
    ? `${formatShort(request!.checkIn)} → ${formatShort(request!.checkOut)}`
    : 'Fechas a coordinar'

  const message = room
    ? `Hola, concierge de ${brand.name}. Quisiera consultar disponibilidad para ${room.name}` +
      (hasDates ? ` del ${formatShort(request!.checkIn)} al ${formatShort(request!.checkOut)} (${nights} noches)` : '') +
      ` para ${stay.guests} ${stay.guests === 1 ? 'huésped' : 'huéspedes'}.`
    : ''

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="modal-title"
      className="m-auto w-[calc(100%-2rem)] max-w-lg overflow-hidden rounded-xl bg-white p-0 text-ink shadow-float"
    >
      {room && (
        <div>
          <div className="flex items-center justify-between bg-primary p-6 text-canvas">
            <div>
              <span className="kicker text-blush">Consulta Directa</span>
              <h3 id="modal-title" className="font-display text-card font-normal">{room.name}</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
            >
              <Icon name="close" className="!text-[20px]" />
            </button>
          </div>
          <div className="flex flex-col gap-4 p-6">
            <div className="flex items-center justify-between gap-4 rounded-lg bg-sand p-4">
              <div>
                <span className="block text-overline font-bold tracking-[0.1em] text-ink-soft uppercase">Tarifa por noche</span>
                <span className="text-xl font-bold text-primary">USD ${room.priceUsd}</span>
              </div>
              <div className="text-right">
                <span className="block text-overline font-bold tracking-[0.1em] text-ink-soft uppercase">Fechas</span>
                <span className="text-[15px] font-semibold">{dates}</span>
              </div>
            </div>
            <p className="text-small text-ink-soft">
              Para confirmar sin recargos, escribinos por WhatsApp directo al concierge de {brand.name}:
            </p>
            <div className="flex flex-col gap-2">
              <a
                href={whatsappLink(message)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 items-center justify-center gap-2 rounded bg-primary text-label text-canvas shadow-soft transition-colors hover:bg-primary-deep"
              >
                <Icon name="chat" className="!text-[20px]" />
                Enviar por WhatsApp al Concierge
              </a>
              <button
                type="button"
                onClick={onUseForm}
                className="h-12 rounded bg-sand text-label text-ink transition-colors hover:bg-mortar"
              >
                Completar formulario web
              </button>
            </div>
          </div>
        </div>
      )}
    </dialog>
  )
}
