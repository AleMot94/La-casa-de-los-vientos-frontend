/**
 * Las 4 instalaciones, en el orden en que aparecen en la página.
 * Los textos (título y descripción) viven en los diccionarios de idioma.
 * Módulo puro: Node lo puede importar sin Vite.
 */
import type { Facility } from '../api/contract'

export const facilities: Facility[] = [
  { id: 'patios', order: 1, photoFolder: 'facilities/patios' },
  { id: 'desayunador', order: 2, photoFolder: 'facilities/desayunador' },
  { id: 'pileta', order: 3, photoFolder: 'facilities/pileta' },
  { id: 'anfitriones', order: 4, photoFolder: 'facilities/anfitriones' },
]
