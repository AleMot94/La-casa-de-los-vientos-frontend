import { roomCapacity, rooms, TOTAL_CAPACITY } from '../data/rooms'
import { useI18n } from '../i18n/useI18n'
import { Icon } from './Icon'
import { PhotoGallery } from './PhotoGallery'
import { SectionHeading } from './SectionHeading'

// Cuánto ocupa la foto en pantalla (ancho CSS). El navegador lo cruza con la densidad de la pantalla
// para elegir el archivo: contenedor de 1.25 rem de margen en celular, 2 rem desde 768 px y grilla de
// 2 columnas (768–1279) o 3 (desde 1280, máximo ~395 px). La tarjeta ancha ocupa la mitad de la fila.
const CARD_SIZES = '(min-width: 1280px) 395px, (min-width: 768px) calc((100vw - 5.5rem) / 2), calc(100vw - 2.5rem)'
const WIDE_SIZES = '(min-width: 1280px) 616px, (min-width: 768px) calc((100vw - 4rem) / 2), calc(100vw - 2.5rem)'

export function Rooms() {
  const { t, describeBeds, describeCapacity } = useI18n()

  return (
    <section id="habitaciones" aria-labelledby="rooms-title" className="w-full bg-canvas py-16 lg:py-24">
      <div className="container-site flex flex-col gap-12">
        <SectionHeading
          id="rooms-title"
          className="max-w-2xl"
          overline={t('rooms.overline')}
          title={t('rooms.title')}
        >
          {t('rooms.intro', { rooms: rooms.length, people: TOTAL_CAPACITY })}
        </SectionHeading>

        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {rooms.map((room, index) => {
            // La última (la más grande) ocupa el ancho completo para no quedar sola en la última fila de la grilla.
            const wide = index === rooms.length - 1
            return (
              <li
                key={room.id}
                className={`flex flex-col overflow-hidden rounded-xl border border-mortar bg-white shadow-soft ${
                  wide ? 'md:col-span-2 md:flex-row xl:col-span-3' : ''
                }`}
              >
                <div className={wide ? 'md:w-1/2' : ''}>
                  <PhotoGallery
                    ids={room.photos}
                    name={room.name}
                    ratio="4/3"
                    sizes={wide ? WIDE_SIZES : CARD_SIZES}
                  />
                </div>
                <div className={`flex flex-col gap-3 p-6 ${wide ? 'md:w-1/2 md:justify-center md:p-10' : ''}`}>
                  <span className="kicker text-secondary-deep">{t('rooms.number', { number: room.number })}</span>
                  <h3 className="font-display text-card text-primary">{room.name}</h3>
                  <p className="text-body text-ink-soft">{describeBeds(room.beds)}</p>
                  <p className="inline-flex w-fit items-center gap-2 rounded-md bg-mortar px-3 py-1 text-small font-semibold text-ink">
                    <Icon name="group" className="!text-[18px] text-secondary" />
                    {describeCapacity(roomCapacity(room))}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
