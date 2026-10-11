/**
 * Las 7 habitaciones, con forma de documento (lo que más adelante puede vivir en una base).
 * Módulo puro: Node lo puede importar sin Vite (ver scripts/export-seed.ts).
 */
import type { Room } from '../api/contract'
import { photoIds } from './photoIds.ts'

export const PHOTOS_PER_ROOM = 6

export const rooms: Room[] = [
  {
    id: 'sonqoy',
    number: 1,
    name: 'Sonqoy',
    beds: { double: 1, single: 0 },
    photos: photoIds('rooms/01-sonqoy', PHOTOS_PER_ROOM),
  },
  {
    id: 'el-fuego',
    number: 2,
    name: 'El Fuego',
    beds: { double: 0, single: 3 },
    photos: photoIds('rooms/02-el-fuego', PHOTOS_PER_ROOM),
  },
  {
    id: 'los-buhos',
    number: 3,
    name: 'Los Búhos',
    beds: { double: 1, single: 1 },
    photos: photoIds('rooms/03-los-buhos', PHOTOS_PER_ROOM),
  },
  {
    id: 'el-amanecer',
    number: 4,
    name: 'El Amanecer',
    beds: { double: 1, single: 2 },
    photos: photoIds('rooms/04-el-amanecer', PHOTOS_PER_ROOM),
  },
  {
    id: 'los-teros',
    number: 5,
    name: 'Los Teros',
    beds: { double: 1, single: 2 },
    photos: photoIds('rooms/05-los-teros', PHOTOS_PER_ROOM),
  },
  {
    id: 'el-atardecer',
    number: 6,
    name: 'El Atardecer',
    beds: { double: 1, single: 2 },
    photos: photoIds('rooms/06-el-atardecer', PHOTOS_PER_ROOM),
  },
  {
    id: 'huayra-huasi',
    number: 7,
    name: 'Huayra Huasi',
    beds: { double: 1, single: 3 },
    photos: photoIds('rooms/07-huayra-huasi', PHOTOS_PER_ROOM),
  },
]

/** Personas que entran en una habitación: matrimonial = 2, individual = 1. */
export function roomCapacity(room: Room): number {
  return room.beds.double * 2 + room.beds.single
}

/** Capacidad total de la hostería: la suma de las habitaciones (hoy, 25). */
export const TOTAL_CAPACITY = rooms.reduce((total, room) => total + roomCapacity(room), 0)
