import { siteConfig } from '../data/siteConfig'

/**
 * Si existe un archivo `src/assets/logo.(svg|png|webp|jpg)` se usa como logo;
 * si no, se muestra el nombre en texto. Para cambiarlo alcanza con dejar el archivo ahí.
 */
const logoFiles = import.meta.glob<string>('../assets/logo.{svg,png,webp,jpg,jpeg}', {
  eager: true,
  query: '?url',
  import: 'default',
})
const logoUrl = Object.values(logoFiles)[0]

interface LogoProps {
  /** Descriptor bajo el nombre (solo en la versión de texto). */
  kicker?: string
  className?: string
}

export function Logo({ kicker, className = '' }: LogoProps) {
  if (logoUrl) {
    return <img src={logoUrl} alt={siteConfig.name} className={`h-10 w-auto ${className}`} />
  }
  return (
    <span className={`flex min-w-0 flex-col ${className}`}>
      <span className="font-display text-base leading-tight font-semibold tracking-tight text-primary sm:text-card">
        {siteConfig.name}
      </span>
      {kicker && <span className="kicker hidden text-secondary-deep sm:block">{kicker}</span>}
    </span>
  )
}
