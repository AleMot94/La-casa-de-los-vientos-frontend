import { Fragment, useState, type FormEvent } from 'react'
import { brand, contact, faqs, mapImage, rooms, wholeHouseOption } from '../data/site'
import { formatShort } from '../lib/dates'
import type { Stay } from '../lib/stay'
import { whatsappLink } from '../lib/whatsapp'
import { Icon } from './Icon'
import { SectionHeading } from './SectionHeading'

interface ContactProps {
  stay: Stay
  onStayChange: (stay: Stay) => void
}

const input =
  'h-12 w-full rounded-lg border border-mortar bg-canvas px-4 text-body text-ink transition placeholder:text-ink-soft/60 focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none'
const labelCls = 'text-overline font-bold tracking-[0.1em] text-ink uppercase'

const cards = [
  {
    icon: 'chat',
    tone: 'bg-tertiary text-canvas',
    label: 'WhatsApp Concierge 24/7',
    value: contact.whatsappDisplay,
    note: 'Respuesta inmediata',
    href: whatsappLink(`Hola, quisiera consultar disponibilidad en ${brand.name}`),
    external: true,
  },
  {
    icon: 'call',
    tone: 'bg-primary text-canvas',
    label: 'Recepción & Casona',
    value: contact.phone,
    note: contact.phoneHours,
    href: `tel:${contact.phone.replace(/\s|-/g, '')}`,
  },
  {
    icon: 'mail',
    tone: 'bg-secondary-deep text-canvas',
    label: 'Correo Electrónico',
    value: contact.email,
    note: 'Tarifas y estadías',
    href: `mailto:${contact.email}`,
  },
  {
    icon: 'pin_drop',
    tone: 'bg-mortar text-primary',
    label: 'Punto Geográfico',
    value: contact.coordinates,
    note: 'Acceso asfaltado',
  },
]

export function Contact({ stay, onStayChange }: ContactProps) {
  const [sent, setSent] = useState(false)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const roomName =
      stay.room === 'casona'
        ? wholeHouseOption
        : rooms.find((r) => r.id === stay.room)?.name ?? 'Cualquiera disponible'
    const lines = [
      `Hola, concierge de ${brand.name}. Quisiera solicitar una estadía.`,
      `Nombre: ${data.get('name')}`,
      `Teléfono: ${data.get('phone')}`,
      `Correo: ${data.get('email')}`,
      `Habitación: ${roomName}`,
      `Llegada: ${formatShort(stay.checkIn)} · Salida: ${formatShort(stay.checkOut)}`,
      `Huéspedes: ${stay.guests}`,
    ]
    const notes = String(data.get('notes') ?? '').trim()
    if (notes) lines.push(`Comentarios: ${notes}`)
    window.open(whatsappLink(lines.join('\n')), '_blank', 'noopener,noreferrer')
    setSent(true)
  }

  return (
    <section id="contacto" aria-labelledby="contact-title" className="w-full bg-canvas py-16 lg:py-24">
      <div className="container-site flex flex-col gap-16">
        <SectionHeading
          id="contact-title"
          className="max-w-2xl"
          overline="Encontranos en la Ruta 40"
          title="Llegar al corazón de la quebrada"
        >
          Ubicada en el circuito entre Salta Capital, la Cuesta del Obispo, Cachi y las bodegas de Cafayate.
        </SectionHeading>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-6">
            <div className="relative isolate flex h-72 flex-col justify-end overflow-hidden rounded-xl p-4 shadow-soft">
              <img src={mapImage} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="flex items-end justify-between gap-3 text-canvas">
                <div className="flex flex-col">
                  <span className="text-[16px] font-bold">{contact.addressLine}</span>
                  <span className="text-small text-blush">{contact.distance}</span>
                </div>
                <a
                  href={contact.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 rounded bg-canvas/90 px-4 py-1.5 text-overline font-bold tracking-[0.1em] text-primary uppercase shadow-soft transition-colors hover:bg-canvas"
                >
                  Abrir GPS
                </a>
              </div>
            </div>

            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {cards.map((c) => {
                const body = (
                  <>
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${c.tone}`}>
                      <Icon name={c.icon} className="!text-[20px]" />
                    </span>
                    <span className="flex min-w-0 flex-col">
                      <span className="text-overline font-bold tracking-[0.1em] text-ink-soft uppercase">{c.label}</span>
                      <span className="text-[14px] font-bold text-ink group-hover:text-primary">
                        {c.value.split('@').map((part, i) => (
                          <Fragment key={part}>
                            {i > 0 && (
                              <>
                                @<wbr />
                              </>
                            )}
                            {part}
                          </Fragment>
                        ))}
                      </span>
                      <span className="text-small text-ink-soft">{c.note}</span>
                    </span>
                  </>
                )
                const cls = 'group flex items-start gap-3 rounded-lg border border-mortar bg-sand p-4 transition-colors'
                return (
                  <li key={c.label}>
                    {c.href ? (
                      <a
                        href={c.href}
                        className={`${cls} h-full hover:bg-mortar`}
                        {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      >
                        {body}
                      </a>
                    ) : (
                      <div className={`${cls} h-full`}>{body}</div>
                    )}
                  </li>
                )
              })}
            </ul>

            <div className="flex flex-col gap-2">
              <h3 className="font-sans text-[16px] font-bold text-primary">Preguntas Frecuentes</h3>
              {faqs.map((f) => (
                <details key={f.q} className="group rounded-lg border border-mortar bg-[#fcf6ee] p-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold text-ink">
                    <span>{f.q}</span>
                    <Icon name="expand_more" className="transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="pt-2 text-small text-ink-soft">{f.a}</p>
                </details>
              ))}
            </div>
          </div>

          <div className="flex flex-col rounded-xl border border-mortar bg-white p-6 shadow-float md:p-10 lg:sticky lg:top-24 lg:col-span-6 lg:self-start">
            <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
              <span className="kicker text-secondary-deep">Reserva Directa</span>
              <span className="rounded bg-sage px-3 py-0.5 text-overline font-bold text-tertiary">
                Atención en menos de 2 hs
              </span>
            </div>
            <h3 className="mb-2 font-display text-card text-primary">Solicitud de Estadía en {brand.name}</h3>
            <p className="mb-6 text-small text-ink-soft">
              Bloqueá tus fechas con la tarifa oficial directa. Al enviar, se abre WhatsApp con tu consulta
              lista para mandar al concierge.
            </p>

            <form onSubmit={onSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label htmlFor="c-name" className={labelCls}>Nombre y Apellido</label>
                  <input id="c-name" name="name" className={input} placeholder="Ej: Santiago Albarracín" autoComplete="name" required />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="c-phone" className={labelCls}>Teléfono o WhatsApp</label>
                  <input id="c-phone" name="phone" type="tel" className={input} placeholder="+54 9 11 5555-5555" autoComplete="tel" required />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label htmlFor="c-email" className={labelCls}>Correo Electrónico</label>
                  <input id="c-email" name="email" type="email" className={input} placeholder="nombre@correo.com" autoComplete="email" required />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="c-room" className={labelCls}>Habitación de Interés</label>
                  <select
                    id="c-room"
                    className={input}
                    value={stay.room}
                    onChange={(e) => onStayChange({ ...stay, room: e.target.value as Stay['room'] })}
                  >
                    <option value="todas">Cualquiera disponible</option>
                    {rooms.map((r) => (
                      <option key={r.id} value={r.id}>{`${r.name} (USD $${r.priceUsd})`}</option>
                    ))}
                    <option value="casona">{wholeHouseOption}</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label htmlFor="c-in" className={labelCls}>Llegada</label>
                  <input
                    id="c-in"
                    type="date"
                    className={input}
                    value={stay.checkIn}
                    onChange={(e) => onStayChange({ ...stay, checkIn: e.target.value })}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="c-out" className={labelCls}>Salida</label>
                  <input
                    id="c-out"
                    type="date"
                    className={input}
                    min={stay.checkIn}
                    value={stay.checkOut}
                    onChange={(e) => onStayChange({ ...stay, checkOut: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="c-notes" className={labelCls}>Mensaje o Pedidos Especiales</label>
                <textarea
                  id="c-notes"
                  name="notes"
                  rows={3}
                  className={`${input} h-auto resize-none py-3`}
                  placeholder="Contanos si viajás con niños, si necesitás traslado o si celebrás una ocasión especial..."
                />
              </div>
              <button
                type="submit"
                className="flex h-12 w-full items-center justify-center gap-2 rounded bg-primary text-label text-canvas shadow-soft transition-colors hover:bg-primary-deep"
              >
                <Icon name="send" className="!text-[20px]" />
                Enviar Solicitud al Concierge
              </button>
            </form>

            {sent && (
              <div role="status" className="mt-4 rounded-lg bg-sage p-4 text-center text-tertiary">
                <span className="block text-[15px] font-bold">Abrimos WhatsApp con tu consulta</span>
                <span className="text-small">
                  Si no se abrió, escribinos a{' '}
                  <a className="font-semibold underline" href={`mailto:${contact.email}`}>{contact.email}</a>.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
