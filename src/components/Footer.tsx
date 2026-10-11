import { brand, contact, rating } from '../data/site'
import { whatsappLink } from '../lib/whatsapp'
import { Icon } from './Icon'

const YEAR = new Date().getFullYear()

const explore = [
  { label: 'Historia de la Casona', href: '#la-hosteria' },
  { label: 'Suites Coloniales', href: '#habitaciones' },
  { label: 'Cava de Altura & Patios', href: '#instalaciones' },
  { label: 'Libro de Huéspedes', href: '#airbnb-resenas' },
  { label: 'Cómo Llegar desde Salta Capital', href: '#contacto' },
]

const heading = 'text-[16px] font-semibold text-ink'
const link = 'inline-flex items-center gap-2 text-ink-soft transition-colors hover:text-primary'

export function Footer() {
  return (
    <footer className="w-full bg-[#fcf6ee] pt-16 pb-10 text-ink-soft">
      <div className="container-site">
        <div className="grid grid-cols-1 gap-10 pb-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <span className="font-display text-card text-primary">{brand.name}</span>
            <p className="text-small">{brand.description}</p>
            <div className="inline-flex w-fit items-center gap-3 rounded-lg bg-sand px-4 py-2">
              <Icon name="verified" className="!text-[20px] text-secondary" />
              <div className="flex flex-col">
                <span className="kicker text-ink">Superhost Airbnb</span>
                <span className="text-small text-secondary-deep">{rating.score} ★ Calificación de Huéspedes</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className={heading}>Ubicación & Terruño</span>
            <div className="flex items-start gap-3">
              <Icon name="location_on" className="!text-[20px] mt-0.5 shrink-0 text-secondary" />
              <address className="text-small not-italic">
                {contact.addressLine}
                <br />
                {contact.addressRegion}
                <br />
                {contact.addressProvince}
              </address>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="terrain" className="!text-[20px] shrink-0 text-secondary" />
              <span className="text-small">{contact.altitude}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className={heading}>Atención & Reservas</span>
            <div className="flex items-center gap-3">
              <Icon name="schedule" className="!text-[20px] shrink-0 text-secondary" />
              <span className="text-small">Recepción: {contact.phoneHours}</span>
            </div>
            <a className={link} href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              <Icon name="chat" className="!text-[20px] shrink-0 text-secondary" />
              <span className="text-small">WhatsApp Concierge Directo</span>
            </a>
            <a
              className={link}
              href={`https://instagram.com/${contact.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="photo_camera" className="!text-[20px] shrink-0 text-secondary" />
              <span className="text-small">{contact.instagram}</span>
            </a>
            <a className={link} href={`mailto:${contact.email}`}>
              <Icon name="mail" className="!text-[20px] shrink-0 text-secondary" />
              <span className="text-small break-all">{contact.email}</span>
            </a>
          </div>

          <div className="flex flex-col gap-3">
            <span className={heading}>Explorar Hostería</span>
            <nav aria-label="Explorar" className="flex flex-col gap-2 text-small">
              {explore.map((l) => (
                <a key={l.href} href={l.href} className="transition-colors hover:text-primary">
                  {l.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="border-t border-mortar pt-6 text-overline font-semibold">
          <p>
            © {YEAR} {brand.name}. Todos los derechos reservados. Valles Calchaquíes, Salta.
          </p>
        </div>
      </div>
    </footer>
  )
}
