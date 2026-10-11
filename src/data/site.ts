/**
 * PLACEHOLDER: todos los datos de este archivo (teléfonos, mail, precios, reseñas,
 * calificación, dirección, disponibilidad) son de ejemplo y deben reemplazarse
 * por los reales antes de publicar.
 */
import biblioteca from '../assets/img/biblioteca.svg'
import cava from '../assets/img/cava.svg'
import fogon from '../assets/img/fogon.svg'
import galeriaMirador from '../assets/img/galeria-mirador.svg'
import hero from '../assets/img/hero.svg'
import mapa from '../assets/img/mapa.svg'
import patio from '../assets/img/patio.svg'
import piscina from '../assets/img/piscina.svg'
import suiteCardones from '../assets/img/suite-cardones.svg'
import suiteQuebrada from '../assets/img/suite-quebrada.svg'
import suiteVientos from '../assets/img/suite-vientos.svg'

export const brand = {
  name: 'La Casa de los Vientos',
  kicker: 'Hostería Boutique · Salta',
  description:
    'Hostería boutique colonial en el corazón de los Valles Calchaquíes. Serenidad, silencio andino y hospitalidad ancestral salteña.',
}

export const contact = {
  whatsappNumber: '5493874950000',
  whatsappDisplay: '+54 9 387 495-0000',
  phone: '+54 387 495-1280',
  phoneHours: '07:30 a 22:30 hs',
  email: 'reservas@lacasadelosvientos.com.ar',
  instagram: '@lacasadelosvientos.salta',
  addressLine: 'Ruta Nacional 40, Km 4320',
  addressRegion: 'Valles Calchaquíes, Cafayate / Cachi',
  addressProvince: 'Provincia de Salta, Argentina',
  distance: 'A 2h 45m de Salta Capital',
  coordinates: `25°58'12" S · 65°55'44" W`,
  altitude: '1.700 m.s.n.m. · Valle Calchaquí',
  mapsUrl: 'https://maps.google.com',
  airbnbUrl: 'https://airbnb.com',
}

export const rating = { score: '4.98', reviews: 142 }

export const navItems = [
  { label: 'La Hostería', href: '#la-hosteria' },
  { label: 'Instalaciones', href: '#instalaciones' },
  { label: 'Habitaciones & Reservas', href: '#habitaciones' },
  { label: 'Airbnb & Reseñas', href: '#airbnb-resenas' },
  { label: 'Contacto', href: '#contacto' },
]

export const heroImage = hero
export const mapImage = mapa
export const aboutImage = patio

export const highlights = [
  { icon: 'workspace_premium', title: '4.98 Superhost', text: 'Preferido en Airbnb Salta' },
  { icon: 'wine_bar', title: 'Vinos de Altura', text: 'Degustación de bienvenida' },
  { icon: 'landscape', title: 'Vistas al Nevado', text: 'Quebrada sin contaminación' },
  { icon: 'bakery_dining', title: 'Desayuno Salteño', text: 'Panes y dulces de cayote' },
]

export const stats = [
  { value: '1.700', unit: 'm', title: 'Altitud Andina', text: 'Clima seco y noches diáfanas', accent: 'primary' },
  { value: '6', unit: '', title: 'Suites Exclusivas', text: 'Privacidad absoluta y descanso', accent: 'primary' },
  { value: '100', unit: '%', title: 'Calidez Familiar', text: 'Hospitalidad y concierge local', accent: 'secondary' },
] as const

export type FacilityCategory = 'exteriores' | 'comunes' | 'cava'

export interface Facility {
  id: string
  category: FacilityCategory
  kicker: string
  icon?: string
  title: string
  text: string
  image: string
  alt: string
  /** Columnas (de 12) que ocupa en la vista "Todas las áreas". */
  span: 7 | 5 | 4
  tall?: boolean
}

export const facilityFilters: { id: 'todos' | FacilityCategory; label: string }[] = [
  { id: 'todos', label: 'Todas las áreas' },
  { id: 'exteriores', label: 'Exteriores & Vistas' },
  { id: 'comunes', label: 'Espacios Comunes' },
  { id: 'cava', label: 'Gastronomía & Cava' },
]

export const facilities: Facility[] = [
  {
    id: 'galeria',
    category: 'exteriores',
    kicker: 'Terraza Panorámica',
    icon: 'wb_sunny',
    title: 'Galería Colonial & Mirador de los Cerros',
    text: 'Espacio sombreado por vigas de quebracho con vista ininterrumpida a las formaciones sedimentarias milenarias.',
    image: galeriaMirador,
    alt: 'Galería colonial con vista a los cerros colorados de los Valles Calchaquíes',
    span: 7,
    tall: true,
  },
  {
    id: 'cava',
    category: 'cava',
    kicker: 'Bodega Propia',
    icon: 'wine_bar',
    title: 'La Cava de Altura',
    text: 'Etiquetas seleccionadas de Cafayate, Molinos y Cachi a temperatura natural de bodega subterránea.',
    image: cava,
    alt: 'Cava subterránea con barricas y mesa de degustación',
    span: 5,
    tall: true,
  },
  {
    id: 'piscina',
    category: 'exteriores',
    kicker: 'Relax Solar',
    title: 'Piscina entre Cardones',
    text: 'Agua templada con sol de montaña los 360 días del año.',
    image: piscina,
    alt: 'Piscina rodeada de cardones bajo el cielo andino',
    span: 4,
  },
  {
    id: 'fogon',
    category: 'comunes',
    kicker: 'Noches Calchaquíes',
    title: 'Fogón Bajo las Estrellas',
    text: 'Encuentros vespertinos al calor de la leña con copas de vino.',
    image: fogon,
    alt: 'Fogón de piedra encendido bajo un cielo estrellado',
    span: 4,
  },
  {
    id: 'biblioteca',
    category: 'comunes',
    kicker: 'Refugio Interior',
    title: 'Biblioteca & Hogar a Leña',
    text: 'El rincón ideal para mañanas frescas o lecturas al cobijo del fuego.',
    image: biblioteca,
    alt: 'Biblioteca con hogar a leña y sillones de cuero',
    span: 4,
  },
]

export interface Room {
  id: 'vientos' | 'cardones' | 'quebrada'
  name: string
  shortName: string
  priceUsd: number
  priceNote: string
  badge: string
  text: string
  chips: string[]
  image: string
  alt: string
}

export const rooms: Room[] = [
  {
    id: 'vientos',
    name: 'Master Suite Los Vientos',
    shortName: 'Suite Los Vientos',
    priceUsd: 110,
    priceNote: '/ noche con desayuno',
    badge: 'Suite Insignia',
    text: 'Nuestra habitación más espaciosa, con ventanal ojival mirando a los cerros colorados, cama King Size vestida con lino puro y mantas de alpaca, estufa a leña privada y living íntimo.',
    chips: ['Cama King 2.00m', 'Balcón Privado', 'Wi-Fi Starlink', 'Cava Frigobar'],
    image: suiteVientos,
    alt: 'Master Suite con ventanal ojival y vista a los cerros colorados',
  },
  {
    id: 'cardones',
    name: 'Suite Colonial Los Cardones',
    shortName: 'Suite Cardones',
    priceUsd: 85,
    priceNote: '/ noche',
    badge: 'Twin o King Convertible',
    text: 'Dos camas twin individuales de algarrobo macizo o unificables a King Size. Cabeceros artesanales en tapiz salteño, vistas hacia el viñedo y baño privado en piedra pórfido.',
    chips: ['2 Twin / 1 King', 'Vista a Viñedos', 'Baño de Piedra'],
    image: suiteCardones,
    alt: 'Suite colonial con dos camas twin y cabeceros en tapiz salteño',
  },
  {
    id: 'quebrada',
    name: 'Junior Suite Quebrada Colorada',
    shortName: 'Suite Quebrada',
    priceUsd: 95,
    priceNote: '/ noche',
    badge: 'Romántica & Silenciosa',
    text: 'Diseñada para parejas que buscan silencio absoluto. Gran ventanal hacia la Quebrada de las Conchas, rincón de lectura con set de yerba mate orgánica salteña y ducha con vista al cerro.',
    chips: ['Cama Queen Size', 'Servicio de Mate', 'Ducha Escocesa'],
    image: suiteQuebrada,
    alt: 'Junior Suite con ventanal hacia la quebrada colorada',
  },
]

export const wholeHouseOption = 'Toda la Casona (Exclusiva 14 huéspedes)'

export const guestOptions = [
  { value: 2, label: '2 Adultos (Ideal)' },
  { value: 1, label: '1 Adulto' },
  { value: 3, label: '3 Adultos' },
  { value: 4, label: '4 Huéspedes (Suite Familiar)' },
]

export interface Review {
  initials: string
  name: string
  origin: string
  text: string
  room: string
  tone: 'secondary' | 'primary' | 'tertiary'
}

export const reviews: Review[] = [
  {
    initials: 'MC',
    name: 'María Clara & Andrés',
    origin: 'Buenos Aires · Hospedados en Feb 2025',
    text: 'Una joya escondida en Salta. El desayuno casero con dulces de cayote y pan de campo recién horneado junto al fuego es inigualable. La vista del atardecer desde la galería de La Casa de los Vientos nos dejó sin palabras.',
    room: 'Master Suite Los Vientos',
    tone: 'secondary',
  },
  {
    initials: 'JS',
    name: 'Jean-Luc Schmitt',
    origin: 'Lyon, Francia · Hospedado en Ene 2025',
    text: 'Hospitalité de dix points. Sentarse en la galería de La Casa de los Vientos mientras la histórica veleta gira suavemente marca el ritmo del valle. Silencio absoluto para dormir y comida criolla sublime.',
    room: 'Suite Colonial Los Cardones',
    tone: 'primary',
  },
  {
    initials: 'VG',
    name: 'Valeria Gorriti',
    origin: 'Córdoba · Hospedada en Dic 2024',
    text: 'Llegamos por una noche y cancelamos otros planes para quedarnos tres días más. El cielo nocturno desde el fogón es algo que nunca habíamos experimentado. Los anfitriones te hacen sentir en casa.',
    room: 'Junior Suite Quebrada',
    tone: 'tertiary',
  },
]

export const faqs = [
  {
    q: '¿Cuáles son los horarios de Check-in y Check-out?',
    a: 'Check-in a partir de las 15:00 hs y check-out hasta las 11:00 hs. Si arribás antes o querés disfrutar de las galerías y la piscina más tarde, cuidamos tu equipaje sin costo.',
  },
  {
    q: '¿Cómo llegar desde el Aeropuerto de Salta (SLA)?',
    a: 'El viaje dura 2h 45m por la Ruta Nacional 68 o por la Cuesta del Obispo hacia Cachi. Podemos coordinar un chofer privado puerta a puerta.',
  },
  {
    q: '¿El desayuno está incluido en la estadía?',
    a: 'Sí, incluye desayuno de campo artesanal: panes recién horneados, dulces caseros de higo y cayote, quesos de cabra e infusiones andinas.',
  },
]

/**
 * PLACEHOLDER de disponibilidad: ocupación determinística de ejemplo.
 * Reemplazar por el calendario real (Airbnb/iCal, planilla, etc.).
 */
export function isOccupied(roomId: Room['id'], date: Date): boolean {
  const seed = roomId === 'vientos' ? 2 : roomId === 'cardones' ? 5 : 8
  return (date.getDate() * 3 + date.getMonth() * 5 + seed) % 7 < 2
}
