import { Fragment } from 'react'
import { siteConfig } from '../data/siteConfig'
import { whatsappLink } from '../lib/whatsapp'
import { Icon } from './Icon'
import { SectionHeading } from './SectionHeading'

const { contact, social, location, maps } = siteConfig

const cards = [
  {
    icon: 'chat',
    tone: 'bg-tertiary text-canvas',
    label: 'WhatsApp',
    value: contact.phoneDisplay,
    href: whatsappLink(`¡Hola! Quisiera hacer una consulta sobre ${siteConfig.name}.`),
    external: true,
  },
  {
    icon: 'call',
    tone: 'bg-primary text-canvas',
    label: 'Teléfono',
    value: contact.phoneDisplay,
    href: `tel:${contact.phoneHref}`,
  },
  {
    icon: 'mail',
    tone: 'bg-secondary-deep text-canvas',
    label: 'Correo electrónico',
    value: contact.email,
    href: `mailto:${contact.email}`,
  },
  {
    icon: 'photo_camera',
    tone: 'bg-mortar text-primary',
    label: 'Instagram',
    value: social.instagramHandle,
    href: social.instagramUrl,
    external: true,
  },
]

export function Contact() {
  return (
    <section id="contacto" aria-labelledby="contact-title" className="w-full bg-canvas py-16 lg:py-24">
      <div className="container-site flex flex-col gap-12">
        {/* TODO(confirmar): «el corazón de la quebrada» es del mockup. */}
        <SectionHeading
          id="contact-title"
          className="max-w-2xl"
          overline={`Encontranos en ${location.locality}`}
          title="Llegar al corazón de la quebrada"
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="flex flex-col justify-between gap-6 rounded-xl border border-mortar bg-sand p-6 shadow-soft md:p-8">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-canvas">
                <Icon name="pin_drop" className="!text-[20px]" />
              </span>
              <address className="flex flex-col not-italic">
                <span className="font-display text-card text-primary">{location.locality}</span>
                <span className="text-body text-ink-soft">
                  {location.region}, {location.province}, {location.country}
                </span>
              </address>
            </div>
            <a
              href={maps.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 w-fit items-center justify-center gap-2 rounded bg-primary px-6 text-label text-canvas shadow-soft transition-colors hover:bg-primary-deep"
            >
              <Icon name="directions" className="!text-[20px]" />
              Cómo llegar
            </a>
          </div>

          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {cards.map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  className="group flex h-full items-start gap-3 rounded-lg border border-mortar bg-sand p-4 transition-colors hover:bg-mortar"
                  {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${c.tone}`}>
                    <Icon name={c.icon} className="!text-[20px]" />
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="text-overline font-bold tracking-[0.1em] text-ink-soft uppercase">{c.label}</span>
                    <span className="text-[14px] font-bold text-ink group-hover:text-primary">
                      {/* <wbr> deja cortar el mail después de la @ en pantallas angostas. */}
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
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
