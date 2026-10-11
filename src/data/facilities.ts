/**
 * Las 4 instalaciones, en el orden en que aparecen en la página.
 * Los textos (título y descripción) viven en los diccionarios de idioma.
 * Módulo puro: Node lo puede importar sin Vite.
 */
import type { Facility } from '../api/contract'
import { photoIds } from './photoIds.ts'

export const PHOTOS_PER_FACILITY = 5

export const facilities: Facility[] = [
  { id: 'patios', order: 1, photos: photoIds('facilities/patios', PHOTOS_PER_FACILITY) },
  { id: 'desayunador', order: 2, photos: photoIds('facilities/desayunador', PHOTOS_PER_FACILITY) },
  { id: 'pileta', order: 3, photos: photoIds('facilities/pileta', PHOTOS_PER_FACILITY) },
  { id: 'anfitriones', order: 4, photos: photoIds('facilities/anfitriones', PHOTOS_PER_FACILITY) },
]
