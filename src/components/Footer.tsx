import { navIds } from '../data/nav'
import { siteConfig } from '../data/siteConfig'
import { useI18n } from '../i18n/useI18n'
import { whatsappLink } from '../lib/whatsapp'
import { Icon } from './Icon'
import { Logo } from './Logo'

const YEAR = new Date().getFullYear()

const { contact, social, location } = siteConfig

const heading = 'text-[16px] font-semibold text-ink'
const link = 'inline-flex items-center gap-2 text-ink-soft transition-colors hover:text-primary'

export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="w-full bg-[#fcf6ee] pt-16 pb-10 text-ink-soft">
      <div className="container-site">
        <div className="grid grid-cols-1 gap-10 pb-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="text-small">{t('footer.description')}</p>
          </div>

          <div className="flex flex-col gap-3">
            <span className={heading}>{t('footer.location')}</span>
            <div className="flex items-start gap-3">
              <Icon name="location_on" className="!text-[20px] mt-0.5 shrink-0 text-secondary" />
              <address className="text-small not-italic">
                {location.locality}
                <br />
                {t('footer.address2')}
                <br />
                {t('footer.address3', { province: location.province })}
              </address>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className={heading}>{t('footer.contact')}</span>
            <a
              className={link}
              href={whatsappLink(t('whatsapp.generic', { name: siteConfig.name }))}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="chat" className="!text-[20px] shrink-0 text-secondary" />
              <span className="text-small">{t('footer.whatsapp')}</span>
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
            <span className={heading}>{t('footer.explore')}</span>
            <nav aria-label={t('footer.explore')} className="flex flex-col gap-2 text-small">
              {navIds.map((id) => (
                <a key={id} href={`#${id}`} className="transition-colors hover:text-primary">
                  {t(`nav.${id}`)}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="border-t border-mortar pt-6 text-overline font-semibold">
          <p>{t('footer.rights', { year: YEAR, name: siteConfig.name, province: location.province })}</p>
        </div>
      </div>
    </footer>
  )
}
