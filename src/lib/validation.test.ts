/// <reference types="node" />
import { afterEach, describe, expect, it, vi } from 'vitest'
import { toISO, today } from './dates'
import { validateBooking, validateContact } from './validation'

const HOY = '2026-12-15'
const MAX = 25
const valido = { checkIn: '2026-12-20', checkOut: '2026-12-23', guests: '3' }

describe('validateBooking', () => {
  it('una consulta correcta no tiene errores', () => {
    expect(validateBooking(valido, HOY, MAX)).toEqual({})
  })

  describe('ingreso', () => {
    it.each([
      ['ayer', '2026-12-14', 'checkIn.past'],
      ['el año pasado', '2025-12-15', 'checkIn.past'],
      ['vacío', '', 'checkIn.required'],
      ['basura', 'mañana', 'checkIn.required'],
    ])('%s', (_caso, checkIn, esperado) => {
      expect(validateBooking({ ...valido, checkIn, checkOut: '2026-12-30' }, HOY, MAX).checkIn).toBe(esperado)
    })

    it('hoy y mañana valen', () => {
      expect(validateBooking({ ...valido, checkIn: HOY }, HOY, MAX).checkIn).toBeUndefined()
      expect(validateBooking({ ...valido, checkIn: '2026-12-16' }, HOY, MAX).checkIn).toBeUndefined()
    })

    it('cruza el fin de mes y de año como texto', () => {
      expect(validateBooking({ ...valido, checkIn: '2027-01-02', checkOut: '2027-01-03' }, '2026-12-31', MAX)).toEqual({})
      expect(validateBooking({ ...valido, checkIn: '2026-12-31' }, '2027-01-01', MAX).checkIn).toBe('checkIn.past')
    })
  })

  describe('egreso', () => {
    it.each([
      ['el mismo día', '2026-12-20', 'checkOut.notAfter'],
      ['un día antes', '2026-12-19', 'checkOut.notAfter'],
      ['vacío', '', 'checkOut.required'],
    ])('%s', (_caso, checkOut, esperado) => {
      expect(validateBooking({ ...valido, checkOut }, HOY, MAX).checkOut).toBe(esperado)
    })

    it('un día después vale', () => {
      expect(validateBooking({ ...valido, checkOut: '2026-12-21' }, HOY, MAX).checkOut).toBeUndefined()
    })

    it('sin ingreso no compara: solo avisa lo que falta', () => {
      expect(validateBooking({ ...valido, checkIn: '' }, HOY, MAX)).toEqual({ checkIn: 'checkIn.required' })
    })
  })

  describe('huéspedes', () => {
    it.each(['1', '3', '25', ' 4 '])('%s vale', (guests) => {
      expect(validateBooking({ ...valido, guests }, HOY, MAX).guests).toBeUndefined()
    })

    it.each([
      ['', 'guests.required'],
      ['   ', 'guests.required'],
      ['0', 'guests.range'],
      ['26', 'guests.range'],
      ['-1', 'guests.range'],
      ['2.5', 'guests.range'],
      ['2,5', 'guests.range'],
      ['1e1', 'guests.range'],
      ['tres', 'guests.range'],
    ])('«%s» → %s', (guests, esperado) => {
      expect(validateBooking({ ...valido, guests }, HOY, MAX).guests).toBe(esperado)
    })

    it('el tope sale del parámetro, no está escrito en la función', () => {
      expect(validateBooking({ ...valido, guests: '5' }, HOY, 4).guests).toBe('guests.range')
      expect(validateBooking({ ...valido, guests: '4' }, HOY, 4).guests).toBeUndefined()
    })
  })

  it('junta los errores de varios campos', () => {
    expect(validateBooking({ checkIn: '2026-12-01', checkOut: '', guests: '0' }, HOY, MAX)).toEqual({
      checkIn: 'checkIn.past',
      checkOut: 'checkOut.required',
      guests: 'guests.range',
    })
  })
})

describe('«hoy» en hora local', () => {
  const zonaOriginal = process.env.TZ

  afterEach(() => {
    vi.useRealTimers()
    if (zonaOriginal === undefined) delete process.env.TZ
    else process.env.TZ = zonaOriginal
  })

  it('a las 23:30 en Salta ya es el día siguiente en UTC, pero «hoy» sigue siendo el de Salta', () => {
    process.env.TZ = 'America/Argentina/Salta'
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-12-16T02:30:00Z')) // 15/12 a las 23:30 en Salta (UTC-3)

    expect(new Date().toISOString().slice(0, 10)).toBe('2026-12-16') // el día en UTC: el error que se evita
    expect(toISO(today())).toBe('2026-12-15')
    // Con el «hoy» local, quien consulta para el 15 no recibe un error.
    expect(validateBooking({ ...valido, checkIn: '2026-12-15' }, toISO(today()), MAX).checkIn).toBeUndefined()
    // Con el «hoy» de UTC, el mismo 15 se rechazaría por error.
    expect(validateBooking({ ...valido, checkIn: '2026-12-15' }, '2026-12-16', MAX).checkIn).toBe('checkIn.past')
  })
})

describe('validateContact', () => {
  const ok = { name: 'Ana Pérez', email: 'ana@correo.com', phone: '', message: 'Quisiera consultar por una estadía.' }

  it('un mensaje correcto no tiene errores (el teléfono es opcional)', () => {
    expect(validateContact(ok)).toEqual({})
    expect(validateContact({ ...ok, phone: '+54 9 3868 46-3838' })).toEqual({})
  })

  it.each([
    ['', 'name.required'],
    ['   ', 'name.required'],
    ['A', 'name.length'],
    ['x'.repeat(101), 'name.length'],
  ])('nombre «%s» → %s', (name, esperado) => {
    expect(validateContact({ ...ok, name }).name).toBe(esperado)
  })

  it('nombre en los límites (2 y 100) vale', () => {
    expect(validateContact({ ...ok, name: 'Al' }).name).toBeUndefined()
    expect(validateContact({ ...ok, name: 'x'.repeat(100) }).name).toBeUndefined()
  })

  it.each([
    ['', 'email.required'],
    ['ana', 'email.invalid'],
    ['ana@', 'email.invalid'],
    ['ana@correo', 'email.invalid'],
    ['ana @correo.com', 'email.invalid'],
    ['ana@@correo.com', 'email.invalid'],
    [`${'a'.repeat(250)}@x.com`, 'email.invalid'],
  ])('email «%s» → %s', (email, esperado) => {
    expect(validateContact({ ...ok, email }).email).toBe(esperado)
  })

  it('el email con espacios en los bordes vale (se envía recortado)', () => {
    expect(validateContact({ ...ok, email: '  ana@correo.com ' }).email).toBeUndefined()
  })

  it('teléfono: hasta 30 caracteres', () => {
    expect(validateContact({ ...ok, phone: '1'.repeat(30) }).phone).toBeUndefined()
    expect(validateContact({ ...ok, phone: '1'.repeat(31) }).phone).toBe('phone.length')
  })

  it.each([
    ['', 'message.required'],
    ['   \n  ', 'message.required'],
    ['Hola', 'message.length'],
    ['x'.repeat(2001), 'message.length'],
  ])('mensaje «%s» → %s', (message, esperado) => {
    expect(validateContact({ ...ok, message }).message).toBe(esperado)
  })

  it('mensaje en los límites (10 y 2000) vale; los espacios de los bordes no cuentan', () => {
    expect(validateContact({ ...ok, message: 'x'.repeat(10) }).message).toBeUndefined()
    expect(validateContact({ ...ok, message: 'x'.repeat(2000) }).message).toBeUndefined()
    expect(validateContact({ ...ok, message: `  ${'x'.repeat(9)}  ` }).message).toBe('message.length')
  })
})
