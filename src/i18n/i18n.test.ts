/// <reference types="node" />
import { describe, expect, it } from 'vitest'
import type { Lang } from '../api/contract'
import { matchLang, pickLang } from './detect'
import { describeBeds, describeCapacity, formatLongDate } from './format'
import { makeT } from './translate'
import { LANGS, translations, type TranslationKey } from './translations'

const keys = Object.keys(translations.es) as TranslationKey[]
const variables = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort()

describe('diccionarios', () => {
  it.each(LANGS)('%s tiene exactamente las mismas claves que el español', (lang) => {
    expect(Object.keys(translations[lang]).sort()).toEqual([...keys].sort())
  })

  it.each(LANGS)('%s no tiene traducciones vacías', (lang) => {
    for (const key of keys) expect(translations[lang][key].trim(), `${lang} → ${key}`).not.toBe('')
  })

  it.each(LANGS)('%s usa las mismas {variables} que el español en cada clave', (lang) => {
    for (const key of keys) {
      expect(variables(translations[lang][key]), `${lang} → ${key}`).toEqual(variables(translations.es[key]))
    }
  })
})

describe('textos sin traducir', () => {
  // Claves que en ese idioma se escriben igual que en español (nombres propios, marcas o palabras iguales).
  const igualesAlEspanol: Record<Exclude<Lang, 'es'>, TranslationKey[]> = {
    en: ['contact.instagram', 'contact.whatsapp', 'facility.patios.title', 'footer.address3', 'footer.whatsapp'],
    fr: ['contact.instagram', 'contact.whatsapp', 'facility.patios.title', 'footer.whatsapp'],
    'pt-BR': [
      'contact.instagram',
      'contact.whatsapp',
      'footer.address3',
      'footer.explore',
      'footer.whatsapp',
      'highlight.family.title',
      'lang.label',
      'nav.label',
      'photo.alt',
    ],
  }

  it.each(LANGS.filter((l) => l !== 'es'))('%s no deja textos en español sin traducir', (lang) => {
    const iguales = keys.filter((key) => translations[lang][key] === translations.es[key])
    expect(iguales.sort()).toEqual([...igualesAlEspanol[lang as Exclude<Lang, 'es'>]].sort())
  })
})

describe('t()', () => {
  it('reemplaza las variables', () => {
    expect(makeT('es')('rooms.number', { number: 3 })).toBe('Habitación 3')
    expect(makeT('fr')('rooms.number', { number: 3 })).toBe('Chambre 3')
  })

  it('si falta una variable deja el {nombre} a la vista', () => {
    expect(makeT('es')('rooms.number')).toBe('Habitación {number}')
    expect(makeT('es')('rooms.number', {})).toBe('Habitación {number}')
  })
})

describe('idioma inicial', () => {
  it('respeta la elección guardada si es válida', () => {
    expect(pickLang('en', ['es-AR'])).toBe('en')
    expect(pickLang('pt-BR', [])).toBe('pt-BR')
  })

  it('ignora una elección guardada inválida y usa el navegador', () => {
    expect(pickLang('xx', ['fr-CA'])).toBe('fr')
    expect(pickLang('', ['en-GB'])).toBe('en')
  })

  it('usa el primer idioma del navegador que la página ofrezca', () => {
    expect(pickLang(null, ['de-DE', 'en-US', 'es'])).toBe('en')
    expect(pickLang(null, ['es-AR', 'en'])).toBe('es')
  })

  it('el portugués de Portugal cae en el de Brasil', () => {
    expect(matchLang('pt-PT')).toBe('pt-BR')
    expect(matchLang('PT-br')).toBe('pt-BR')
    expect(pickLang(null, ['pt-PT'])).toBe('pt-BR')
  })

  it('sin coincidencia, español', () => {
    expect(pickLang(null, ['de', 'ja'])).toBe('es')
    expect(pickLang(null, [])).toBe('es')
    expect(matchLang('zh-CN')).toBeNull()
  })
})

describe('descripción de camas y capacidad', () => {
  const casos: [Lang, string, string, string, string][] = [
    ['es', '1 cama matrimonial y 2 camas individuales', '3 camas individuales', '1 persona', '4 personas'],
    ['en', '1 double bed and 2 single beds', '3 single beds', '1 guest', '4 guests'],
    ['fr', '1 lit double et 2 lits simples', '3 lits simples', '1 personne', '4 personnes'],
    ['pt-BR', '1 cama de casal e 2 camas de solteiro', '3 camas de solteiro', '1 pessoa', '4 pessoas'],
  ]

  it.each(casos)('%s', (lang, mixto, soloIndividuales, una, cuatro) => {
    const t = makeT(lang)
    expect(describeBeds(t, lang, { double: 1, single: 2 })).toBe(mixto)
    expect(describeBeds(t, lang, { double: 0, single: 3 })).toBe(soloIndividuales)
    expect(describeCapacity(t, lang, 1)).toBe(una)
    expect(describeCapacity(t, lang, 4)).toBe(cuatro)
  })

  it('una sola cama usa el singular', () => {
    expect(describeBeds(makeT('es'), 'es', { double: 1, single: 0 })).toBe('1 cama matrimonial')
    expect(describeBeds(makeT('es'), 'es', { double: 1, single: 1 })).toBe('1 cama matrimonial y 1 cama individual')
  })
})

describe('fecha con el mes en letras', () => {
  it.each([
    ['es', '15 de diciembre de 2026'],
    ['en', 'December 15, 2026'],
    ['fr', '15 décembre 2026'],
    ['pt-BR', '15 de dezembro de 2026'],
  ] as const)('%s', (lang, esperado) => {
    expect(formatLongDate(lang, '2026-12-15')).toBe(esperado)
  })

  it('el día no depende de la zona horaria de quien mira', () => {
    const original = process.env.TZ
    try {
      for (const zona of ['America/Argentina/Salta', 'Pacific/Honolulu', 'Pacific/Auckland', 'UTC']) {
        process.env.TZ = zona
        expect(formatLongDate('es', '2026-12-15'), zona).toBe('15 de diciembre de 2026')
      }
    } finally {
      if (original === undefined) delete process.env.TZ
      else process.env.TZ = original
    }
  })

  it('el error que se evita: la fecha ISO sola es medianoche UTC y en Salta cae el día 14', () => {
    const original = process.env.TZ
    try {
      process.env.TZ = 'America/Argentina/Salta'
      expect(new Date('2026-12-15').getDate()).toBe(14)
      expect(new Date(2026, 11, 15).getDate()).toBe(15)
    } finally {
      if (original === undefined) delete process.env.TZ
      else process.env.TZ = original
    }
  })
})
