/**
 * Arma los ids de foto de una carpeta:
 * `photoIds('rooms/01-sonqoy', 3)` → `['rooms/01-sonqoy/01', 'rooms/01-sonqoy/02', 'rooms/01-sonqoy/03']`.
 * Es el mismo id que el backend devuelve en `PhotoData.id` (ver `src/api/contract.ts`).
 */
export function photoIds(folder: string, count: number): string[] {
  return Array.from(
    { length: count },
    (_, i) => `${folder}/${String(i + 1).padStart(2, "0")}`,
  );
}
