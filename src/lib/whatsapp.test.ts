import { describe, expect, it } from 'vitest'
import type { Lang } from '../api/contract'
import { makeT } from '../i18n/translate'
import { bookingMessage, whatsappLink } from './whatsapp'

const consulta = { checkIn: '2026-12-15', checkOut: '2026-12-18', guests: 3 }

const esperados: Record<Lang, string> = {
  es: [
    '¡Hola! Quisiera consultar disponibilidad en La Casa de los Vientos.',
    '',
    '• Ingreso: 15 de diciembre de 2026',
    '• Egreso: 18 de diciembre de 2026',
    '• Huéspedes: 3',
  ].join('\n'),
  en: [
    'Hello! I’d like to ask about availability at La Casa de los Vientos.',
    '',
    '• Check-in: December 15, 2026',
    '• Check-out: December 18, 2026',
    '• Guests: 3',
  ].join('\n'),
  fr: [
    'Bonjour ! Je souhaiterais connaître les disponibilités à La Casa de los Vientos.',
    '',
    '• Arrivée : 15 décembre 2026',
    '• Départ : 18 décembre 2026',
    '• Voyageurs : 3',
  ].join('\n'),
  'pt-BR': [
    'Olá! Gostaria de consultar a disponibilidade em La Casa de los Vientos.',
    '',
    '• Entrada: 15 de dezembro de 2026',
    '• Saída: 18 de dezembro de 2026',
    '• Hóspedes: 3',
  ].join('\n'),
}

describe('bookingMessage', () => {
  it.each(Object.keys(esperados) as Lang[])('%s: texto exacto sin habitación', (lang) => {
    expect(bookingMessage(makeT(lang), lang, consulta)).toBe(esperados[lang])
  })

  it.each([
    ['es', '• Habitación: Sonqoy'],
    ['en', '• Room: Sonqoy'],
    ['fr', '• Chambre : Sonqoy'],
    ['pt-BR', '• Quarto: Sonqoy'],
  ] as const)('%s: con habitación, suma una línea al final', (lang, linea) => {
    expect(bookingMessage(makeT(lang), lang, { ...consulta, room: 'Sonqoy' })).toBe(`${esperados[lang]}\n${linea}`)
  })

  it('una habitación vacía no se menciona', () => {
    expect(bookingMessage(makeT('es'), 'es', { ...consulta, room: '' })).toBe(esperados.es)
  })
})

describe('whatsappLink', () => {
  const url = (lang: Lang, room?: string) => whatsappLink(bookingMessage(makeT(lang), lang, { ...consulta, room }))
  const texto = (enlace: string) => decodeURIComponent(enlace.split('?text=')[1])

  it.each(Object.keys(esperados) as Lang[])('%s: va al número de la hostería y el mensaje vuelve idéntico al decodificar', (lang) => {
    const enlace = url(lang)
    expect(enlace.startsWith('https://wa.me/5493868463838?text=')).toBe(true)
    expect(texto(enlace)).toBe(esperados[lang])
  })

  it('codifica espacios, saltos de línea, tildes y viñetas (nada crudo en la URL)', () => {
    const codificado = url('es').split('?text=')[1]
    expect(codificado).not.toMatch(/[\s¡•é]/)
    expect(codificado).toContain('%0A%0A') // la línea en blanco
    expect(codificado).toContain('%E2%80%A2') // •
    expect(codificado).toContain('%C2%A1') // ¡
  })

  it('un & o un # en un dato no cortan el mensaje', () => {
    const enlace = url('es', 'Sol & Luna #1')
    expect(enlace.split('?text=')[1]).not.toMatch(/[&#]/)
    expect(texto(enlace)).toContain('• Habitación: Sol & Luna #1')
  })

  it('sin mensaje, solo el chat', () => {
    expect(whatsappLink()).toBe('https://wa.me/5493868463838')
  })
})
