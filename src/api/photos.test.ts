import { describe, expect, it, vi } from 'vitest'
import { loadPhotos } from './photos'

const respuesta = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status })
const signal = new AbortController().signal

describe('loadPhotos', () => {
  it('pide /api/photos y devuelve la lista', async () => {
    const lista = [{ id: 'hero', width: 1200, height: 800, files: {} }]
    const fetchFn = vi.fn().mockResolvedValue(respuesta(lista))
    await expect(loadPhotos(signal, fetchFn)).resolves.toEqual(lista)
    expect(fetchFn.mock.calls[0][0]).toBe('/api/photos')
    expect(fetchFn.mock.calls[0][1].signal).toBe(signal)
  })

  it('lanza si el HTTP no es 2xx', async () => {
    const fetchFn = vi.fn().mockResolvedValue(respuesta({ error: 'internal' }, 500))
    await expect(loadPhotos(signal, fetchFn)).rejects.toThrow('HTTP 500')
  })

  it('lanza si el cuerpo no es una lista', async () => {
    const fetchFn = vi.fn().mockResolvedValue(respuesta({ data: [] }))
    await expect(loadPhotos(signal, fetchFn)).rejects.toThrow('no es una lista')
  })

  it('lanza si el cuerpo no es JSON', async () => {
    const fetchFn = vi.fn().mockResolvedValue(new Response('<html>', { status: 200 }))
    await expect(loadPhotos(signal, fetchFn)).rejects.toThrow()
  })
})
