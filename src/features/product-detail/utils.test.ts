import { isOfferWithId } from './utils'

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
})
