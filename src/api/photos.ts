import type { PhotoData } from './contract'

/**
 * Trae las fotos del backend (`GET /api/photos` → `PhotoData[]`). Es el ÚNICO lugar donde se hace el pedido.
 *
 * La ruta es relativa: en desarrollo el proxy de Vite (`vite.config.ts`) la manda al backend y en producción
 * la atiende el mismo dominio. Si falla (red, HTTP que no sea 2xx o un cuerpo que no sea una lista) lanza,
 * y el `PhotosProvider` deja los placeholders.
 */
export async function loadPhotos(signal: AbortSignal, fetchFn: typeof fetch = fetch): Promise<PhotoData[]> {
  const res = await fetchFn('/api/photos', { signal, headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`) // `fetch` NO falla solo con un 404 o un 500
  const data: unknown = await res.json()
  if (!Array.isArray(data)) throw new Error('La respuesta de /api/photos no es una lista')
  return data as PhotoData[]
}
