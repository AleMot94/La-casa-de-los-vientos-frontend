/**
 * Datos del negocio: el ÚNICO lugar donde viven. Nada de esto va escrito en los componentes.
 */
const lat = -25.886311932084475
const lng = -65.93076858465554

export const siteConfig = {
  name: 'La Casa de los Vientos',

  /** Nombres propios: no se traducen. La región («Valle Calchaquí») y el país sí, y viven en los diccionarios. */
  location: {
    locality: 'San Carlos',
    province: 'Salta',
    lat,
    lng,
  },

  contact: {
    /** Para `https://wa.me/<número>`: sin `+` ni espacios. */
    whatsappNumber: '5493868463838',
    /** Para `tel:`. */
    phoneHref: '+5493868463838',
    /** Cómo se muestra. WhatsApp y teléfono son el mismo número. */
    phoneDisplay: '+54 9 3868 46-3838',
    email: 'reservas@casadelosvientos.com.ar',
  },

  social: {
    instagramHandle: '@lacasadelosvientos_ok',
    instagramUrl: 'https://www.instagram.com/lacasadelosvientos_ok/',
  },

  maps: {
    /** Botón «Cómo llegar» (Maps URLs, oficial y sin clave). */
    directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
    /** Mapa embebido sin clave. Formato no documentado por Google: si dejara de andar, usar Compartir → Incorporar un mapa. */
    embedUrl: `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`,
  },
}
