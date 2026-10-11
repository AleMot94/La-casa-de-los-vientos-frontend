/**
 * Secciones de la página que enlazan el navbar y el footer.
 * El id es el ancla (`#conocenos`); la etiqueta sale de la traducción `nav.<id>`.
 */
export const navIds = ['conocenos', 'habitaciones', 'instalaciones', 'contacto'] as const

export type NavId = (typeof navIds)[number]
