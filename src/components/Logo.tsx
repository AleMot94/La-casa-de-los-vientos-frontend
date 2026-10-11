export function Logo({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" aria-hidden="true">
      <path
        d="M7 36V17C7 9.8 12.8 4 20 4s13 5.8 13 13v19"
        stroke="#7b1e2b"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M12 22c2.5-2.2 4.5-2.2 7 0s4.5 2.2 7 0 4.5-2.2 6-.8M12 28c2.5-2.2 4.5-2.2 7 0s4.5 2.2 7 0 4.5-2.2 6-.8"
        stroke="#c86d51"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}
