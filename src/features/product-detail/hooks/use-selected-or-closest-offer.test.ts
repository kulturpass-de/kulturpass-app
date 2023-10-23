import { renderHook } from '@testing-library/react-native'
import { Offer } from '../../../services/api/types/commerce/api-types'
import { ProductDetail } from '../types/product-detail'
import { useSelectedOrClosestOffer } from './use-selected-or-closest-offer'

const productDetail: ProductDetail = {
  offers: [
    {
      id: 'offer1',
      shopDistance: 6,
      price: {
        value: 1,
      },
    },
    {
      id: 'offer2',
      shopDistance: undefined,
    },
    {
      id: 'offer3',
      shopDistance: 5,
      price: {
        value: 1000,
      },
    },
    {
      id: 'offer4',
      shopDistance: 7,
      price: {
        value: 0,
      },
    },
  ] as Offer[],
} as any

const productDetailWithoutDistance: ProductDetail = {
  offers: [
    {
      id: 'offer1',
      price: {
        value: 3,
      },
    },
    {
      id: 'offer2',
      price: {
        value: 2,
      },
    },
    {
      id: 'offer3',
      price: {
        value: 1,
      },
    },
    {
      id: 'offer4',
      price: {
        value: 2,
      },
    },
  ],
} as any

describe('useSelectedOrClosestOffer', () => {
  test('Should return selected offer for a valid selectedOfferId', () => {
    const { result } = renderHook(() => useSelectedOrClosestOffer(productDetail, 'offer2'))
    expect(result.current?.id).toBe('offer2')
  })

  test('Should return the closest offer when no selectedOfferId is provided', () => {
    const { result } = renderHook(() => useSelectedOrClosestOffer(productDetail))
    expect(result.current?.id).toBe('offer3')
  })

  test('Should return the closest offer when an invalid selectedOfferId is provided', () => {
    const { result } = renderHook(() => useSelectedOrClosestOffer(productDetail, 'OFFER3'))
    expect(result.current?.id).toBe('offer3')
  })

  test('Should return undefined when product does not have offers and no selectedOfferId is provided', () => {
    const { result } = renderHook(() => useSelectedOrClosestOffer({} as any))
    expect(result.current).toBeUndefined()
  })

  test('Should return undefined when product does not have offers and a selectedOfferId is provided', () => {
    const { result } = renderHook(() => useSelectedOrClosestOffer({} as any, 'offer2'))
    expect(result.current).toBeUndefined()
  })

  test('Should return the product with the lowest price when no distance is provided', () => {
    const { result } = renderHook(() => useSelectedOrClosestOffer(productDetailWithoutDistance))
    expect(result.current?.id).toBe('offer3')
  })
})
