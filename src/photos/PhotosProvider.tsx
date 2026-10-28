import { useEffect, useMemo, useState, type ReactNode } from 'react'
import type { PhotoData } from '../api/contract'
import { loadPhotos } from '../api/photos'
import { idsInFolder, indexPhotos } from '../lib/photo'
import { PhotosContext, type Photos, type PhotosStatus } from './context'

interface State {
  status: PhotosStatus
  photos: Record<string, PhotoData>
}

export function PhotosProvider({ children }: { children: ReactNode }) {
  // Un solo estado para el estado del pedido y las fotos: así nunca hay un dibujo con `ready` pero sin fotos.
  const [state, setState] = useState<State>({ status: 'loading', photos: {} })

  useEffect(() => {
    // En desarrollo, StrictMode monta, desmonta y vuelve a montar este componente. La limpieza cancela el
    // primer pedido; sin eso su respuesta (de una ejecución ya «muerta») podría llegar y escribir en el estado.
    const controller = new AbortController()

    async function load() {
      try {
        const list = await loadPhotos(controller.signal)
        if (!controller.signal.aborted) setState({ status: 'ready', photos: indexPhotos(list) })
      } catch (error) {
        if (controller.signal.aborted) return // la cancelamos nosotros: no es un error, no se avisa ni se cambia el estado
        if (import.meta.env.DEV) console.warn('No se pudieron cargar las fotos:', error)
        setState({ status: 'error', photos: {} }) // quedan los placeholders; la página sigue andando
      }
    }

    void load()
    return () => controller.abort()
  }, [])

  const value = useMemo<Photos>(
    () => ({
      status: state.status,
      getPhoto: (id) => state.photos[id],
      idsIn: (folder) => idsInFolder(state.photos, folder),
    }),
    [state],
  )

  return <PhotosContext value={value}>{children}</PhotosContext>
}
