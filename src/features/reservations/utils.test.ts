import { getBackgdropIndex, lastDigitOfString } from './utils'

describe('lastDigitOfString', () => {
  it('should return the last digit found in a string', () => {
    expect(lastDigitOfString('abc4deff5gs')).toBe(5)
    expect(lastDigitOfString('abc4deff5gs1')).toBe(1)
    expect(lastDigitOfString('3abc')).toBe(3)
    expect(lastDigitOfString('abc')).toBe(NaN)
  })
})

describe('getBackgdropIndex', () => {
  it('should downscale the given baseTenIndex to the given maxIndex', () => {
    expect(getBackgdropIndex(0, 5)).toBe(0)
    expect(getBackgdropIndex(1, 5)).toBe(0)
    expect(getBackgdropIndex(2, 5)).toBe(1)
    expect(getBackgdropIndex(3, 5)).toBe(1)
    expect(getBackgdropIndex(4, 5)).toBe(2)
    expect(getBackgdropIndex(5, 5)).toBe(2)
    expect(getBackgdropIndex(6, 5)).toBe(3)
    expect(getBackgdropIndex(7, 5)).toBe(3)
    expect(getBackgdropIndex(8, 5)).toBe(4)
    expect(getBackgdropIndex(9, 5)).toBe(4)
  })
})
