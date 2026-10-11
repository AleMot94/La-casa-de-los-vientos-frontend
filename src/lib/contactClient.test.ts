import { describe, expect, it, vi } from 'vitest'
import type { ContactRequest } from '../api/contract'
import { buildContactRequest, parseContactResponse, submitContact } from './contactClient'

const entrada = { name: '  Ana Pérez ', email: ' ana@correo.com ', phone: '', message: '  Quisiera consultar por una estadía.  ' }

describe('buildContactRequest', () => {
  it('recorta los espacios, agrega el idioma y el asunto fijo, y omite el teléfono vacío', () => {
    expect(buildContactRequest(entrada, 'fr')).toEqual({
      name: 'Ana Pérez',
      email: 'ana@correo.com',
      message: 'Quisiera consultar por una estadía.',
      language: 'fr',
      subject: 'Consulta desde la web',
    })
  })

  it('incluye el teléfono si hay, y nunca el campo honeypot', () => {
    const pedido = buildContactRequest({ ...entrada, phone: ' +54 9 3868 46-3838 ' }, 'es')
    expect(pedido.phone).toBe('+54 9 3868 46-3838')
    expect('website' in pedido).toBe(false)
  })
})

describe('parseContactResponse', () => {
  it('200 con { ok: true } es éxito', () => {
    expect(parseContactResponse(200, { ok: true })).toEqual({ ok: true })
  })

  it.each(['invalid', 'rate_limited', 'unavailable'] as const)('respeta el error «%s» del contrato', (error) => {
    expect(parseContactResponse(400, { ok: false, error })).toEqual({ ok: false, error })
  })

  it('conserva `fields` si vienen como lista de textos', () => {
    expect(parseContactResponse(400, { ok: false, error: 'invalid', fields: ['email', 3, 'message'] })).toEqual({
      ok: false,
      error: 'invalid',
      fields: ['email', 'message'],
    })
  })

  it('sin cuerpo válido, decide el código HTTP', () => {
    expect(parseContactResponse(400, undefined)).toEqual({ ok: false, error: 'invalid' })
    expect(parseContactResponse(429, undefined)).toEqual({ ok: false, error: 'rate_limited' })
    expect(parseContactResponse(500, undefined)).toEqual({ ok: false, error: 'unavailable' })
    expect(parseContactResponse(502, 'Bad Gateway')).toEqual({ ok: false, error: 'unavailable' })
  })

  it('nunca da por enviado algo que no cumple el contrato', () => {
    expect(parseContactResponse(200, undefined)).toEqual({ ok: false, error: 'unavailable' })
    expect(parseContactResponse(200, { success: true })).toEqual({ ok: false, error: 'unavailable' }) // respuesta de otro servicio
    expect(parseContactResponse(200, { ok: 'yes' })).toEqual({ ok: false, error: 'unavailable' })
    expect(parseContactResponse(500, { ok: true })).toEqual({ ok: false, error: 'unavailable' }) // `ok: true` con un 500 no vale
    expect(parseContactResponse(200, { ok: false, error: 'otra-cosa' })).toEqual({ ok: false, error: 'unavailable' })
  })
})

describe('submitContact', () => {
  const pedido: ContactRequest = buildContactRequest(entrada, 'es')
  const respuesta = (status: number, body: unknown) =>
    ({ status, ok: status < 300, json: () => Promise.resolve(body) }) as Response

  it('hace POST JSON al endpoint con el pedido', async () => {
    const fetchFn = vi.fn().mockResolvedValue(respuesta(200, { ok: true }))
    await expect(submitContact('/api/contact', pedido, { fetchFn })).resolves.toEqual({ ok: true })

    expect(fetchFn).toHaveBeenCalledTimes(1)
    const [url, init] = fetchFn.mock.calls[0]
    expect(url).toBe('/api/contact')
    expect(init.method).toBe('POST')
    expect(init.headers).toEqual({ 'Content-Type': 'application/json', Accept: 'application/json' })
    expect(JSON.parse(init.body)).toEqual(pedido)
    expect(init.signal).toBeInstanceOf(AbortSignal)
  })

  it('devuelve el error del contrato que mande el servidor', async () => {
    const fetchFn = vi.fn().mockResolvedValue(respuesta(429, { ok: false, error: 'rate_limited' }))
    await expect(submitContact('/api/contact', pedido, { fetchFn })).resolves.toEqual({ ok: false, error: 'rate_limited' })
  })

  it('una respuesta que no es JSON (página de error de un proxy) es «unavailable»', async () => {
    const fetchFn = vi.fn().mockResolvedValue({ status: 502, ok: false, json: () => Promise.reject(new SyntaxError('no es JSON')) })
    await expect(submitContact('/api/contact', pedido, { fetchFn })).resolves.toEqual({ ok: false, error: 'unavailable' })
  })

  it('red caída o corte: «unavailable», y nunca lanza', async () => {
    const fetchFn = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'))
    await expect(submitContact('/api/contact', pedido, { fetchFn })).resolves.toEqual({ ok: false, error: 'unavailable' })
  })

  it('si la señal de afuera se cancela, la del pedido también', async () => {
    const afuera = new AbortController()
    const fetchFn = vi.fn().mockResolvedValue(respuesta(200, { ok: true }))
    await submitContact('/api/contact', pedido, { fetchFn, signal: afuera.signal })
    const señal: AbortSignal = fetchFn.mock.calls[0][1].signal
    expect(señal.aborted).toBe(false)
    afuera.abort()
    expect(señal.aborted).toBe(true)
  })
})
