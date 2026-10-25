import { describe, expect, it } from 'vitest'
import { facilities } from './facilities'
import { platforms } from './platforms'
import { roomCapacity, rooms, TOTAL_CAPACITY } from './rooms'
import { siteConfig } from './siteConfig'

const PHOTO_FOLDER = /^(rooms|facilities)\/[a-z0-9-]+$/

describe('habitaciones', () => {
  it('son 7, numeradas de 1 a 7, con ids únicos en minúsculas', () => {
    expect(rooms.map((r) => r.number)).toEqual([1, 2, 3, 4, 5, 6, 7])
    const ids = rooms.map((r) => r.id)
    expect(new Set(ids).size).toBe(7)
    for (const id of ids) expect(id).toMatch(/^[a-z]+(-[a-z]+)*$/)
  })

  it('los nombres son los de la hostería', () => {
    expect(rooms.map((r) => r.name)).toEqual([
      'Sonqoy',
      'El Fuego',
      'Los Búhos',
      'El Amanecer',
      'Los Teros',
      'El Atardecer',
      'Huayra Huasi',
    ])
  })

  it('la capacidad sale de las camas y la suma total es 25', () => {
    expect(rooms.map(roomCapacity)).toEqual([2, 3, 3, 4, 4, 4, 5])
    expect(TOTAL_CAPACITY).toBe(25)
  })

  it('cada una apunta a su carpeta de fotos (rooms/NN-id)', () => {
    for (const room of rooms) {
      expect(room.photoFolder).toBe(`rooms/${String(room.number).padStart(2, '0')}-${room.id}`)
    }
  })
})

describe('instalaciones', () => {
  it('son 4, en orden, con su carpeta de fotos', () => {
    expect(facilities.map((f) => f.id)).toEqual(['patios', 'desayunador', 'pileta', 'anfitriones'])
    expect(facilities.map((f) => f.order)).toEqual([1, 2, 3, 4])
    for (const f of facilities) expect(f.photoFolder).toBe(`facilities/${f.id}`)
  })
})

describe('fotos', () => {
  it('11 carpetas únicas y con el formato esperado', () => {
    const all = [...rooms, ...facilities].map((x) => x.photoFolder)
    expect(all).toHaveLength(7 + 4)
    expect(new Set(all).size).toBe(all.length)
    for (const folder of all) expect(folder).toMatch(PHOTO_FOLDER)
  })
})

describe('plataformas', () => {
  it('Airbnb y Booking; si hay puntuación, trae su escala', () => {
    expect(platforms.map((p) => p.id)).toEqual(['airbnb', 'booking'])
    for (const p of platforms) {
      if (p.rating !== undefined) expect(p.ratingScale).toBeDefined()
    }
  })
})

describe('datos del negocio', () => {
  it('WhatsApp, teléfono, mail e Instagram son los informados', () => {
    expect(siteConfig.contact.whatsappNumber).toBe('5493868463838')
    expect(siteConfig.contact.phoneHref).toBe('+5493868463838')
    expect(siteConfig.contact.email).toBe('reservas@casadelosvientos.com.ar')
    expect(siteConfig.social.instagramUrl).toBe('https://www.instagram.com/lacasadelosvientos_ok/')
  })

  it('«Cómo llegar» usa las coordenadas exactas', () => {
    expect(siteConfig.maps.directionsUrl).toBe(
      'https://www.google.com/maps/dir/?api=1&destination=-25.886311932084475,-65.93076858465554',
    )
  })
})
