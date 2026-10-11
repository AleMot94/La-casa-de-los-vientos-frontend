import { describe, expect, it } from 'vitest'
import type { PhotoData } from '../api/contract'
import { buildSrcSet, fallbackFiles, pickSrc } from './photo'

const files = [
  { url: '/x-1200.webp', width: 1200 },
  { url: '/x-480.webp', width: 480 },
  { url: '/x-800.webp', width: 800 },
]

describe('buildSrcSet', () => {
  it('ordena de menor a mayor y usa el formato «url ancho w»', () => {
    expect(buildSrcSet(files)).toBe('/x-480.webp 480w, /x-800.webp 800w, /x-1200.webp 1200w')
  })

  it('no modifica la lista original', () => {
    const copia = [...files]
    buildSrcSet(files)
    expect(files).toEqual(copia)
  })

  it('una lista vacía da un texto vacío', () => {
    expect(buildSrcSet([])).toBe('')
  })
})

describe('pickSrc', () => {
  it('elige el menor que llegue al mínimo', () => {
    expect(pickSrc(files).width).toBe(800)
    expect(pickSrc(files, 500).width).toBe(800)
    expect(pickSrc(files, 480).width).toBe(480)
  })

  it('si ninguno llega, el más grande', () => {
    expect(pickSrc(files, 5000).width).toBe(1200)
  })
})

describe('fallbackFiles', () => {
  const base = { id: 'rooms/01-sonqoy/01', width: 3000, height: 2000 }
  const avif = [{ url: '/a.avif', width: 480 }]
  const webp = [{ url: '/a.webp', width: 480 }]
  const jpeg = [{ url: '/a.jpg', width: 480 }]

  it('prefiere WebP, después JPEG, después AVIF', () => {
    expect(fallbackFiles({ ...base, files: { avif, webp, jpeg } } satisfies PhotoData)).toBe(webp)
    expect(fallbackFiles({ ...base, files: { avif, jpeg } })).toBe(jpeg)
    expect(fallbackFiles({ ...base, files: { avif } })).toBe(avif)
  })

  it('ignora las listas vacías y devuelve undefined si no hay nada', () => {
    expect(fallbackFiles({ ...base, files: { webp: [], jpeg } })).toBe(jpeg)
    expect(fallbackFiles({ ...base, files: {} })).toBeUndefined()
  })
})
