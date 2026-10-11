/**
 * Plataformas donde está publicada la hostería.
 * La puntuación y la cantidad de reseñas son opcionales y se cargan a mano:
 * ni Airbnb ni Booking ofrecen una API pública para traerlas.
 * Módulo puro: Node lo puede importar sin Vite.
 */
import type { Platform } from '../api/contract'

export const platforms: Platform[] = [
  // TODO: URL del anuncio de Airbnb
  { id: 'airbnb', url: '' },
  // TODO: URL del anuncio de Booking
  { id: 'booking', url: '' },
]
