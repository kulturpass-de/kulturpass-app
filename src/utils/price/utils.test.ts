import { isPriceWithValue } from './utils'

describe('Price Utils', () => {
  describe('isPriceWithValue', () => {
    test('should return true when value and currencyIso are present', () => {
      expect(isPriceWithValue({ value: 2, currencyIso: 'EUR' })).toBeTruthy()
      expect(isPriceWithValue({ value: 9454345, currencyIso: 'USD' })).toBeTruthy()
    })

    test('should return false when value or currencyIso is missing', () => {
      expect(isPriceWithValue({})).toBeFalsy()
      expect(isPriceWithValue({ value: 4 })).toBeFalsy()
      expect(isPriceWithValue({ currencyIso: 'USD', formattedValue: '1234' })).toBeFalsy()
    })
  })
})
