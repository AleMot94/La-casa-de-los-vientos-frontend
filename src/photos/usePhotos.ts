import { useContext } from 'react'
import { PhotosContext, type Photos } from './context'

/** `const { status, getPhoto } = usePhotos()` en cualquier componente dentro de `<PhotosProvider>`. */
export function usePhotos(): Photos {
  const value = useContext(PhotosContext)
  if (!value) throw new Error('usePhotos tiene que usarse dentro de <PhotosProvider>')
  return value
}
