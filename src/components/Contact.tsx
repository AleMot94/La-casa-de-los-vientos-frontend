import { Fragment } from 'react'
import { siteConfig } from '../data/siteConfig'
import { useI18n } from '../i18n/useI18n'
import { contactEndpoint } from '../lib/contactClient'
import { whatsappLink } from '../lib/whatsapp'
import { ContactForm } from './ContactForm'
import { Icon } from './Icon'
import { PlatformCards } from './PlatformCards'
import { SectionHeading } from './SectionHeading'

const { contact, social, location, maps } = siteConfig
const endpoint = contactEndpoint()
// Sin endpoint el formulario no puede enviar: en producción no se muestra (queda el resto de los datos de
// contacto); en desarrollo se ve, con un aviso, para poder trabajarlo.
const showForm = Boolean(endpoint) || import.meta.env.DEV

export function Contact() {
  const { t } = useI18n()

  const cards: { icon: string; tone: string; label: string; value: string; href?: string; external?: boolean }[] = [
    {
      icon: 'chat',
      tone: 'bg-tertiary text-canvas',
      label: t('contact.whatsapp'),
      value: contact.phoneDisplay,
      href: whatsappLink(t('whatsapp.generic', { name: siteConfig.name })),
      external: true,
    },
    {
      icon: 'call',
      tone: 'bg-primary text-canvas',
      label: t('contact.phone'),
      value: contact.phoneDisplay,
      href: `tel:${contact.phoneHref}`,
    },
    {
      icon: 'mail',
      tone: 'bg-secondary-deep text-canvas',
      label: t('contact.email'),
      value: contact.email,
      // Sin `href`: el correo es solo informativo (no abre el cliente de correo).
    },
    {
      icon: 'photo_camera',
      tone: 'bg-mortar text-primary',
      label: t('contact.instagram'),
      value: social.instagramHandle,
      href: social.instagramUrl,
      external: true,
    },
  ]

  return (
    <section id="contacto" aria-labelledby="contact-title" className="w-full bg-canvas py-16 lg:py-24">
      <div className="container-site flex flex-col gap-12">
        <SectionHeading
          id="contact-title"
          className="max-w-2xl"
          overline={t('contact.overline', { locality: location.locality })}
          title={t('contact.title')}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-5 rounded-xl border border-mortar bg-sand p-6 shadow-soft md:p-8">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-canvas">
                <Icon name="pin_drop" className="!text-[20px]" />
              </span>
              <address className="flex flex-col not-italic">
                <span className="font-display text-card text-primary">{location.locality}</span>
                <span className="text-body text-ink-soft">{t('contact.address', { province: location.province })}</span>
              </address>
            </div>
            {/* Mapa embebido sin clave. Carga diferida: no se pide hasta que se acerca a la pantalla. */}
            <div className="relative min-h-72 flex-1 overflow-hidden rounded-lg border border-mortar bg-mortar">
              <iframe
                src={maps.embedUrl}
                title={t('contact.map.title', { name: siteConfig.name })}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
            <a
              href={maps.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 w-fit items-center justify-center gap-2 rounded bg-primary px-6 text-label text-canvas shadow-soft transition-colors hover:bg-primary-deep"
            >
              <Icon name="directions" className="!text-[20px]" />
              {t('contact.directions')}
            </a>
          </div>

          <div className="flex flex-col gap-8">
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {cards.map((c) => {
                const content = (
                  <>
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
                  </>
                )
                const box = 'flex h-full items-start gap-3 rounded-lg border border-mortar bg-sand p-4'
                return (
                  <li key={c.icon}>
                    {c.href ? (
                      <a
                        href={c.href}
                        className={`group ${box} transition-colors hover:bg-mortar`}
                        {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      >
                        {content}
                      </a>
                    ) : (
                      <div className={box}>{content}</div>
                    )}
                  </li>
                )
              })}
            </ul>
            <PlatformCards />
          </div>
        </div>

        {showForm && <ContactForm endpoint={endpoint} />}
      </div>
    </section>
  )
}
