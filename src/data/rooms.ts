/**
 * Las 7 habitaciones, con forma de documento (lo que más adelante puede vivir en una base).
 * Módulo puro: Node lo puede importar sin Vite.
 */
import type { Room } from '../api/contract'

export const rooms: Room[] = [
  {
    id: 'sonqoy',
    number: 1,
    name: 'Sonqoy',
    beds: { double: 1, single: 0 },
    photoFolder: 'rooms/01-sonqoy',
  },
  {
    id: 'el-fuego',
    number: 2,
    name: 'El Fuego',
    beds: { double: 0, single: 3 },
    photoFolder: 'rooms/02-el-fuego',
  },
  {
    id: 'los-buhos',
    number: 3,
    name: 'Los Búhos',
    beds: { double: 1, single: 1 },
    photoFolder: 'rooms/03-los-buhos',
  },
  {
    id: 'el-amanecer',
    number: 4,
    name: 'El Amanecer',
    beds: { double: 1, single: 2 },
    photoFolder: 'rooms/04-el-amanecer',
  },
  {
    id: 'los-teros',
    number: 5,
    name: 'Los Teros',
    beds: { double: 1, single: 2 },
    photoFolder: 'rooms/05-los-teros',
  },
  {
    id: 'el-atardecer',
    number: 6,
    name: 'El Atardecer',
    beds: { double: 1, single: 2 },
    photoFolder: 'rooms/06-el-atardecer',
  },
  {
    id: 'huayra-huasi',
    number: 7,
    name: 'Huayra Huasi',
    beds: { double: 1, single: 3 },
    photoFolder: 'rooms/07-huayra-huasi',
  },
]

/** Personas que entran en una habitación: matrimonial = 2, individual = 1. */
export function roomCapacity(room: Room): number {
  return room.beds.double * 2 + room.beds.single
}

/** Capacidad total de la hostería: la suma de las habitaciones (hoy, 25). */
export const TOTAL_CAPACITY = rooms.reduce((total, room) => total + roomCapacity(room), 0)
