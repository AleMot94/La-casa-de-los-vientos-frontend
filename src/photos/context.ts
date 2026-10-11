import { createContext } from 'react'
import type { PhotoData } from '../api/contract'

/**
 * Cómo va el pedido de fotos al backend:
 * - `loading`: todavía no respondió (los placeholders pulsan);
 * - `ready`: respondió (puede que no haya ninguna foto);
 * - `error`: falló (quedan los placeholders, quietos).
 */
export type PhotosStatus = 'loading' | 'ready' | 'error'

/** Lo que cualquier componente puede pedirle al registro de fotos (ver `usePhotos`). */
export interface Photos {
  status: PhotosStatus
  /** Datos de una foto, o `undefined` si el backend todavía no la entregó (o no existe). */
  getPhoto: (id: string) => PhotoData | undefined
}

export const PhotosContext = createContext<Photos | null>(null)
