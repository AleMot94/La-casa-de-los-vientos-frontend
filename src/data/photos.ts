/**
 * Fotos disponibles, por id. Hoy está vacío: las fotos las sirve el backend y, hasta que lleguen,
 * la página muestra placeholders con la proporción exacta.
 * Cuando exista el backend, este registro se carga desde su API (es el único lugar que cambia).
 */
import type { PhotoData } from '../api/contract'

export const photos: Record<string, PhotoData> = {}

export function getPhoto(id: string): PhotoData | undefined {
  return photos[id]
}
