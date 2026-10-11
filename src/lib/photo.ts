import type { PhotoData, PhotoFile } from '../api/contract'

/**
 * Arma el `srcset` de una lista de archivos, de menor a mayor ancho:
 * `[{ url: 'a.webp', width: 480 }, { url: 'b.webp', width: 800 }]` → `'a.webp 480w, b.webp 800w'`.
 */
export function buildSrcSet(files: PhotoFile[]): string {
  return [...files]
    .sort((a, b) => a.width - b.width)
    .map((file) => `${file.url} ${file.width}w`)
    .join(', ')
}

/** Archivos para el `<img>` de respaldo: WebP; si no hay, JPEG; si tampoco, AVIF. */
export function fallbackFiles(photo: PhotoData): PhotoFile[] | undefined {
  const { webp, jpeg, avif } = photo.files
  return [webp, jpeg, avif].find((files) => files && files.length > 0)
}

/**
 * Archivo para el atributo `src` del `<img>` (lo usa el navegador si no entiende `srcset`):
 * el menor que llegue a `minWidth` o, si ninguno llega, el más grande.
 */
export function pickSrc(files: PhotoFile[], minWidth = 800): PhotoFile {
  const sorted = [...files].sort((a, b) => a.width - b.width)
  return sorted.find((file) => file.width >= minWidth) ?? sorted[sorted.length - 1]
}
