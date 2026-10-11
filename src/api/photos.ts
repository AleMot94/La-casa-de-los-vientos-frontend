import type { PhotoData } from './contract'

/**
 * Trae las fotos del backend. Es el ÚNICO lugar donde se hace el pedido.
 *
 * Hoy no hace ninguno: devuelve una lista vacía y la página muestra placeholders.
 *
 * TODO: acá va el `fetch` al backend. Pasale `{ signal }` para que se pueda cancelar, controlá `res.ok`
 * (`fetch` NO falla con un 404 o un 500) y devolvé la lista de `PhotoData` (ver `contract.ts`).
 */
export async function loadPhotos(signal: AbortSignal): Promise<PhotoData[]> {
  signal.throwIfAborted() // si ya se canceló, ni empezar
  return []
}
