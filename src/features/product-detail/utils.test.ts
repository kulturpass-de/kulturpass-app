import { isDefinedAddress, isOfferWithId } from './utils'

describe('Product Detail Utils', () => {
  describe('isOfferWithId', () => {
    test('should return true when id is present', () => {
      expect(isOfferWithId({ id: 'asdf' })).toBeTruthy()
      expect(isOfferWithId({ id: '12345' })).toBeTruthy()
    })

    test('should return false when id is missing', () => {
      expect(isOfferWithId({})).toBeFalsy()
      expect(isOfferWithId({ code: 'asdf' })).toBeFalsy()
    })
  })

  describe('isDefinedAddress', () => {
    test('should return true if one field is defined', () => {
      expect(isDefinedAddress({ name: 'test' })).toBeTruthy()
      expect(isDefinedAddress({ street: 'test' })).toBeTruthy()
      expect(isDefinedAddress({ postalCode: 'test' })).toBeTruthy()
      expect(isDefinedAddress({ city: 'test' })).toBeTruthy()
      expect(isDefinedAddress({ city: 'test', name: 'test', postalCode: 'test', street: 'test' })).toBeTruthy()
    })

    test('should return false if address is empty', () => {
      expect(isDefinedAddress({})).toBeFalsy()
      expect(isDefinedAddress(undefined)).toBeFalsy()
    })
  })
})
