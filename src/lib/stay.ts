import type { Room } from '../data/site'
import { addDays, today, toISO } from './dates'

export interface Stay {
  checkIn: string
  checkOut: string
  guests: number
  room: 'todas' | 'casona' | Room['id']
}

export function defaultStay(): Stay {
  const start = addDays(today(), 14)
  return {
    checkIn: toISO(start),
    checkOut: toISO(addDays(start, 4)),
    guests: 2,
    room: 'todas',
  }
}
