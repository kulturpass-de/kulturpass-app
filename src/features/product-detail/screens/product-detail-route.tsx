import React, { useCallback } from 'react'

import { useModalNavigation } from '../../../navigation/modal/hooks'
import { ModalScreenProps } from '../../../navigation/modal/types'
import { createRouteConfig } from '../../../navigation/utils/createRouteConfig'
import { Offer } from '../../../services/api/types/commerce/api-types'
import { modalCardStyle } from '../../../theme/utils'
import { ProductDetailErrorAlert } from '../components/product-detail-error-alert'
import { useQueryProductDetail } from '../hooks/use-query-product-detail'
import { useSelectedOrClosestOffer } from '../hooks/use-selected-or-closest-offer'
import { ProductDetailScreen } from './product-detail-screen'

export const ProductDetailRouteName = 'ProductDetail'

export type ProductDetailRouteParams = {
  productCode: string
  offerId?: Offer['id']
}

type ProfileScreenProps = ModalScreenProps<'ProductDetail'>

export const ProductDetailRoute: React.FC<ProfileScreenProps> = ({ route }) => {
  const modalNavigation = useModalNavigation()
  const { productCode, offerId } = route.params

  const onClose = useCallback(() => {
    modalNavigation.closeModal()
  }, [modalNavigation])

  const onOfferSelection = useCallback(() => {
    modalNavigation.navigate({ screen: 'OfferSelection', params: { productCode } })
  }, [modalNavigation, productCode])

  const { data: productDetail, error, isLoading } = useQueryProductDetail(productCode)

  const selectedOffer = useSelectedOrClosestOffer(productDetail, offerId)

  const reserveProduct = useCallback(async () => {
    if (!selectedOffer?.code) {
      return
    }

    modalNavigation.navigate({
      screen: 'ProductConfirmReservation',
      params: { productCode, offerId: selectedOffer.id },
    })
  }, [productCode, selectedOffer, modalNavigation])

  if (!productDetail) {
    return (
      <ProductDetailErrorAlert
        error="productDetail_getProductDetailError_message"
        visible={!isLoading && !!error}
        onClose={onClose}
      />
    )
  }

  return (
    <ProductDetailScreen
      onClose={onClose}
      onOfferSelection={onOfferSelection}
      productDetail={productDetail}
      selectedOffer={selectedOffer}
      reserveProduct={reserveProduct}
    />
  )
}

export const ProductDetailRouteConfig = createRouteConfig({
  name: ProductDetailRouteName,
  component: ProductDetailRoute,
  options: { cardStyle: modalCardStyle },
})
