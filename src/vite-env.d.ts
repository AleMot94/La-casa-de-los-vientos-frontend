/// <reference types="vite/client" />

/** Variables de entorno propias (ver `.env.example`). Vite solo expone las que empiezan con `VITE_`. */
interface ImportMetaEnv {
  /** URL del backend que recibe el formulario de contacto (`POST`, JSON). Ver `src/lib/contactClient.ts`. */
  readonly VITE_CONTACT_ENDPOINT?: string
}
