interface IconProps {
  name: string
  className?: string
}

/** Ícono decorativo de Material Symbols (ver `index.html`). */
export function Icon({ name, className = '' }: IconProps) {
  return (
    <span className={`material-symbols-outlined ${className}`} aria-hidden="true">
      {name}
    </span>
  )
}
