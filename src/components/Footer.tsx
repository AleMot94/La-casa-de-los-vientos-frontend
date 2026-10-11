import { navItems } from '../data/nav'
import { siteConfig } from '../data/siteConfig'
import { whatsappLink } from '../lib/whatsapp'
import { Icon } from './Icon'
import { Logo } from './Logo'

const YEAR = new Date().getFullYear()

const { contact, social, location } = siteConfig

const heading = 'text-[16px] font-semibold text-ink'
const link = 'inline-flex items-center gap-2 text-ink-soft transition-colors hover:text-primary'

export function Footer() {
  return (
    <footer className="w-full bg-[#fcf6ee] pt-16 pb-10 text-ink-soft">
      <div className="container-site">
        <div className="grid grid-cols-1 gap-10 pb-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Logo />
            {/* TODO(confirmar): «colonial» es del mockup. */}
            <p className="text-small">
              Hostería colonial en el corazón de los Valles Calchaquíes. Serenidad, silencio andino y hospitalidad
              ancestral salteña.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <span className={heading}>Ubicación</span>
            <div className="flex items-start gap-3">
              <Icon name="location_on" className="!text-[20px] mt-0.5 shrink-0 text-secondary" />
              <address className="text-small not-italic">
                {location.locality}
                <br />
                {location.region}
                <br />
                {location.province}, {location.country}
              </address>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className={heading}>Contacto</span>
            <a
              className={link}
              href={whatsappLink(`¡Hola! Quisiera hacer una consulta sobre ${siteConfig.name}.`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="chat" className="!text-[20px] shrink-0 text-secondary" />
              <span className="text-small">WhatsApp</span>
            </a>
            <a className={link} href={`tel:${contact.phoneHref}`}>
              <Icon name="call" className="!text-[20px] shrink-0 text-secondary" />
              <span className="text-small">{contact.phoneDisplay}</span>
            </a>
            <a className={link} href={`mailto:${contact.email}`}>
              <Icon name="mail" className="!text-[20px] shrink-0 text-secondary" />
              <span className="text-small break-all">{contact.email}</span>
            </a>
            <a className={link} href={social.instagramUrl} target="_blank" rel="noopener noreferrer">
              <Icon name="photo_camera" className="!text-[20px] shrink-0 text-secondary" />
              <span className="text-small">{social.instagramHandle}</span>
            </a>
          </div>

          <div className="flex flex-col gap-3">
            <span className={heading}>Explorar</span>
            <nav aria-label="Explorar" className="flex flex-col gap-2 text-small">
              {navItems.map((item) => (
                <a key={item.id} href={`#${item.id}`} className="transition-colors hover:text-primary">
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="border-t border-mortar pt-6 text-overline font-semibold">
          <p>
            © {YEAR} {siteConfig.name}. Todos los derechos reservados. {location.region}, {location.province}.
          </p>
        </div>
      </div>
    </footer>
  )
}
