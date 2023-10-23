import { ProductDetail, ProductTypes } from './types/product-detail'
import { isOfferWithId, isProductVoucherPickup } from './utils'

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

  describe('isProductVoucherPickup', () => {
    it('should return true when product is a voucher for pickup', async () => {
      expect(
        isProductVoucherPickup({
          productType: ProductTypes.Voucher,
          isVoucherPickupRequired: true,
        } as ProductDetail),
      ).toBe(true)

      expect(
        isProductVoucherPickup({
          productType: ProductTypes.Voucher,
          isVoucherPickupRequired: false,
        } as ProductDetail),
      ).toBe(false)

      expect(
        isProductVoucherPickup({
          productType: ProductTypes.Audio,
          isVoucherPickupRequired: true,
        } as any as ProductDetail),
      ).toBe(false)

      expect(
        isProductVoucherPickup({
          productType: ProductTypes.Audio,
          isVoucherPickupRequired: false,
        } as any as ProductDetail),
      ).toBe(false)
    })
  })
})
