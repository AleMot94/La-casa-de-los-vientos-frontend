import { facilities } from '../data/facilities'
import { useI18n } from '../i18n/useI18n'
import { PhotoGallery } from './PhotoGallery'
import { SectionHeading } from './SectionHeading'

// Cuánto ocupa la foto en pantalla: una columna hasta 1023 px y media fila (máx. ~592 px) desde ahí.
const FACILITY_SIZES = '(min-width: 1024px) 592px, (min-width: 768px) calc(100vw - 4rem), calc(100vw - 2.5rem)'

export function Facilities() {
  const { t } = useI18n()

  return (
    <section
      id="instalaciones"
      aria-labelledby="facilities-title"
      className="w-full bg-[#fcf6ee] py-16 lg:py-24"
    >
      <div className="container-site flex flex-col gap-12 lg:gap-16">
        <SectionHeading
          id="facilities-title"
          className="max-w-lg"
          overline={t('facilities.overline')}
          title={t('facilities.title')}
        />

        <ul className="flex flex-col gap-12 lg:gap-16">
          {facilities.map((facility, index) => {
            const title = t(`facility.${facility.id}.title`)
            return (
              <li key={facility.id} className="grid grid-cols-1 items-center gap-6 lg:grid-cols-2 lg:gap-12">
                <div className={`flex flex-col gap-2 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <span className="kicker text-secondary-deep">{String(facility.order).padStart(2, '0')}</span>
                  <h3 className="font-display text-headline-sm text-primary">{title}</h3>
                  <p className="max-w-lg text-body text-ink-soft">{t(`facility.${facility.id}.text`)}</p>
                </div>
                <PhotoGallery
                  folder={facility.photoFolder}
                  name={title}
                  ratio="3/2"
                  sizes={FACILITY_SIZES}
                  className="rounded-xl shadow-float"
                />
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
