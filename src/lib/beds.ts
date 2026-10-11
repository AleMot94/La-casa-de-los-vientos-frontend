import type { Beds } from '../api/contract'

// Provisorio, solo en español: en la etapa de idiomas pasa a depender del idioma activo.

const listFormat = new Intl.ListFormat('es', { style: 'long', type: 'conjunction' })

/** `{ double: 1, single: 2 }` → «1 cama matrimonial y 2 camas individuales». */
export function describeBeds({ double, single }: Beds): string {
  const parts: string[] = []
  if (double) parts.push(`${double} ${double === 1 ? 'cama matrimonial' : 'camas matrimoniales'}`)
  if (single) parts.push(`${single} ${single === 1 ? 'cama individual' : 'camas individuales'}`)
  return listFormat.format(parts)
}

/** `4` → «4 personas». */
export function describeCapacity(people: number): string {
  return `${people} ${people === 1 ? 'persona' : 'personas'}`
}
