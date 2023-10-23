import { useMemo } from 'react'
import { Offer } from '../../../services/api/types/commerce/api-types'
import { ProductDetail } from '../types/product-detail'

/**
 * If there is a selected offer, return it. Otherwise return the closest offer by shopDistance.
 * If there is no closest offer, the offer with the lowest price should be picked.
 */
export const useSelectedOrClosestOffer = (productDetail?: ProductDetail, selectedOfferId?: Offer['id']) => {
  return useMemo(() => {
    const selectedOffer = productDetail?.offers?.find(offer => offer.id === selectedOfferId)

    if (selectedOffer) {
      return selectedOffer
    }

    const closestOffer = productDetail?.offers?.reduce<Offer | undefined>((prev, curr) => {
      // If one is of both is undefined, it should be ignored
      if (prev === undefined) {
        return curr
      } else if (curr === undefined) {
        return prev
      }

      // Compare lowest distance first
      if (prev.shopDistance !== undefined || curr.shopDistance !== undefined) {
        if (prev.shopDistance === undefined) {
          return curr
        } else if (curr.shopDistance === undefined) {
          return prev
        }
        return prev.shopDistance <= curr.shopDistance ? prev : curr
      }

      // Compare lowest price second
      return (prev.price?.value ?? 0) <= (curr.price?.value ?? 0) ? prev : curr
    }, undefined)

    return closestOffer
  }, [productDetail, selectedOfferId])
}
