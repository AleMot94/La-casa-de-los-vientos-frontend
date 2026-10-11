import type { ReactNode } from 'react'

interface SectionHeadingProps {
  overline: string
  title: string
  children?: ReactNode
  id?: string
  className?: string
}

export function SectionHeading({ overline, title, children, id, className = '' }: SectionHeadingProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <span className="kicker text-secondary-deep">{overline}</span>
      <h2 id={id} className="font-display text-headline-sm md:text-headline tracking-tight text-primary">
        {title}
      </h2>
      {children && <p className="mt-1 text-body text-ink-soft">{children}</p>}
    </div>
  )
}
