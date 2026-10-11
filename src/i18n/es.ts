/**
 * Español rioplatense (voseo). Es la FUENTE DE VERDAD: las claves de los demás idiomas
 * se tipan contra este archivo, así que si falta o sobra una traducción, `tsc` falla.
 *
 * `{nombre}` se reemplaza al traducir: t('rooms.number', { number: 3 }).
 * Los nombres propios (habitaciones, localidad, provincia) no se traducen y vienen de src/data/.
 */
export const es = {
  // ── Página ────────────────────────────────────────────────────────────────
  'meta.title': 'La Casa de los Vientos · Hostería en Salta',
  'meta.description':
    'Hostería en San Carlos, Valle Calchaquí, Salta. Habitaciones privadas, desayuno salteño y ambiente familiar. Consultá disponibilidad por WhatsApp.',
  'lang.label': 'Idioma',

  // ── Navegación ────────────────────────────────────────────────────────────
  'nav.label': 'Principal',
  'nav.conocenos': 'Conocenos',
  'nav.habitaciones': 'Habitaciones',
  'nav.instalaciones': 'Instalaciones',
  'nav.contacto': 'Contacto',
  'header.kicker': 'Hostería · {province}',
  'header.logoLabel': '{name}, inicio',
  'header.menuOpen': 'Abrir menú',
  'header.menuClose': 'Cerrar menú',

  // ── Hero ──────────────────────────────────────────────────────────────────
  'hero.location': '{locality} · Valle Calchaquí, {province}',
  'hero.title': 'El Refugio Auténtico de los Valles Calchaquíes',
  // TODO(confirmar): adobe centenario, muros encalados, cielorrasos de cardón, viñedos de altura.
  'hero.lead':
    'Una hostería de adobe centenario, muros encalados y cielorrasos de cardón. Entre viñedos de altura, silencios de montaña y el fuego encendido al caer la tarde.',
  'highlight.breakfast.title': 'Desayuno Salteño',
  'highlight.breakfast.text': 'Panes y dulces de cayote',
  'highlight.family.title': 'Ambiente familiar',
  // TODO(confirmar): subtítulo escrito por nosotros a partir de «ambiente familiar»; sin datos concretos.
  'highlight.family.text': 'Calidez de hogar',

  // ── Barra de consulta ─────────────────────────────────────────────────────
  'booking.formLabel': 'Consultar disponibilidad',
  'booking.checkIn': 'Llegada',
  'booking.checkOut': 'Salida',
  'booking.guests': 'Huéspedes',
  'booking.room': 'Habitación',
  'booking.anyRoom': 'Cualquiera disponible',
  'booking.submit': 'Ver Disponibilidad',

  // ── Conocenos ─────────────────────────────────────────────────────────────
  // TODO(confirmar): toda la historia y la construcción vienen del mockup, no del cliente.
  'about.overline': 'Patrimonio Calchaquí & Raigambre',
  'about.title': 'Donde el viento del cerro susurra la historia de la casona',
  // El nombre de la casa va en negrita entre las dos mitades (ver About.tsx).
  'about.p1.before': 'Emplazada sobre un antiguo sendero arriero que unía los valles con la puna, ',
  'about.p1.after':
    ' conserva la arquitectura sobria y térmica del adobe amasado con paja de las vegas altas. Su emblema rinde tributo a la histórica veleta de hierro forjado que desde el siglo XIX orientaba a los caminantes según los caprichos del viento zonda.',
  'about.p2':
    'Cada rincón ha sido intervenido con respeto patrimonial: tirantes macizos de cardón rescatados, pisos cocidos a horno de leña, mantas tejidas en telar criollo por artesanos de Seclantás y una quietud ininterrumpida que solo el Norte Argentino puede brindar.',
  'about.stat.rooms.title': 'Habitaciones privadas',
  'about.stat.rooms.text': 'Privacidad absoluta y descanso',
  'about.stat.people.title': 'Personas',
  'about.stat.people.text': 'Capacidad total de la hostería',
  'about.quote':
    '“{name} no es un hotel de paso; es una pausa sagrada entre las formaciones rojizas de la quebrada y el perfume dulce del Torrontés.”',
  'about.caption.title': 'Patio de los Jazmines',
  'about.caption.text': 'Lugar del té andino y lectura al atardecer',
  'about.eco': 'Construcción ecológica de barro cocido',

  // ── Habitaciones ──────────────────────────────────────────────────────────
  'rooms.overline': 'Habitaciones',
  'rooms.title': 'Descanso profundo en sintonía con la tierra',
  'rooms.intro': '{rooms} habitaciones privadas, con capacidad total para {people} personas.',
  'rooms.number': 'Habitación {number}',
  // Plurales: se elige `one` u `other` con Intl.PluralRules.
  'beds.double.one': '{count} cama matrimonial',
  'beds.double.other': '{count} camas matrimoniales',
  'beds.single.one': '{count} cama individual',
  'beds.single.other': '{count} camas individuales',
  'capacity.one': '{count} persona',
  'capacity.other': '{count} personas',
  'photo.alt': '{name}, foto {n}',

  // ── Instalaciones ─────────────────────────────────────────────────────────
  'facilities.overline': 'Espacios de Descanso & Naturaleza',
  'facilities.title': 'Instalaciones pensadas para reconectar',
  'facility.patios.title': 'Patios',
  'facility.patios.text': 'TODO: texto de Patios.',
  'facility.desayunador.title': 'Desayunador',
  'facility.desayunador.text': 'TODO: texto de Desayunador.',
  'facility.pileta.title': 'Pileta',
  'facility.pileta.text': 'TODO: texto de Pileta.',
  'facility.anfitriones.title': 'Anfitriones',
  'facility.anfitriones.text': 'TODO: texto de Anfitriones.',

  // ── Contacto ──────────────────────────────────────────────────────────────
  // TODO(confirmar): «el corazón de la quebrada» es del mockup.
  'contact.overline': 'Encontranos en {locality}',
  'contact.title': 'Llegar al corazón de la quebrada',
  'contact.address': 'Valle Calchaquí, {province}, Argentina',
  'contact.directions': 'Cómo llegar',
  'contact.whatsapp': 'WhatsApp',
  'contact.phone': 'Teléfono',
  'contact.email': 'Correo electrónico',
  'contact.instagram': 'Instagram',
  'whatsapp.generic': '¡Hola! Quisiera hacer una consulta sobre {name}.',

  // ── Footer ────────────────────────────────────────────────────────────────
  // TODO(confirmar): «colonial» es del mockup.
  'footer.description':
    'Hostería colonial en el corazón de los Valles Calchaquíes. Serenidad, silencio andino y hospitalidad ancestral salteña.',
  'footer.location': 'Ubicación',
  'footer.address2': 'Valle Calchaquí',
  'footer.address3': '{province}, Argentina',
  'footer.contact': 'Contacto',
  'footer.whatsapp': 'WhatsApp',
  'footer.explore': 'Explorar',
  'footer.rights': '© {year} {name}. Todos los derechos reservados. Valle Calchaquí, {province}.',
}

export type Translation = Record<keyof typeof es, string>
