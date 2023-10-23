import { useMemo } from 'react'
import { Offer } from '../../../services/api/types/commerce/api-types'
import { ProductDetail } from '../types/product-detail'

export const useSelectedOrClosestOffer = (productDetail?: ProductDetail, selectedOfferId?: Offer['id']) => {
  return useMemo(() => {
    const selectedOffer = productDetail?.offers?.find(offer => offer.id === selectedOfferId)

    if (selectedOffer) {
      return selectedOffer
    }

    const closestOffer = productDetail?.offers?.reduce<Offer | undefined>((prev, curr) => {
      if (prev === undefined || prev.shopDistance === undefined) {
        return curr
      } else if (curr.shopDistance === undefined) {
        return prev
      } else {
        return prev.shopDistance <= curr.shopDistance ? prev : curr
      }
    }, undefined)

    return closestOffer
  }, [productDetail, selectedOfferId])
}
