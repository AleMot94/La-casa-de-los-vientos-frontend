import { describe, expect, it } from 'vitest'
import { describeBeds, describeCapacity } from './beds'

describe('describeBeds', () => {
  it('una matrimonial', () => {
    expect(describeBeds({ double: 1, single: 0 })).toBe('1 cama matrimonial')
  })

  it('solo individuales, en plural', () => {
    expect(describeBeds({ double: 0, single: 3 })).toBe('3 camas individuales')
  })

  it('una matrimonial y una individual', () => {
    expect(describeBeds({ double: 1, single: 1 })).toBe('1 cama matrimonial y 1 cama individual')
  })

  it('una matrimonial y tres individuales', () => {
    expect(describeBeds({ double: 1, single: 3 })).toBe('1 cama matrimonial y 3 camas individuales')
  })
})

describe('describeCapacity', () => {
  it('singular y plural', () => {
    expect(describeCapacity(1)).toBe('1 persona')
    expect(describeCapacity(4)).toBe('4 personas')
  })
})
