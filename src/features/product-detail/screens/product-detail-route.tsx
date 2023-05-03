import React, { useCallback } from 'react'

import { useModalNavigation } from '../../../navigation/modal/hooks'
import { ModalScreenProps } from '../../../navigation/modal/types'
import { createRouteConfig } from '../../../navigation/utils/createRouteConfig'
import { Offer } from '../../../services/api/types/commerce/api-types'
import { useDismissableError } from '../../../services/errors/use-dismissable-error'
import { modalCardStyle } from '../../../theme/utils'
import { ErrorAlert } from '../../form-validation/components/error-alert'
import { useQueryProductDetail } from '../hooks/use-query-product-detail'
import { useSelectedOrClosestOffer } from '../hooks/use-selected-or-closest-offer'
import { ProductDetailScreen } from './product-detail-screen'
import { LoadingIndicator } from '../../../components/loading-indicator/loading-indicator'

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

  const { visibleError, onDismissVisibleError } = useDismissableError(!isLoading ? error : undefined)

  const handleDismissErrorAndClose = useCallback(() => {
    onDismissVisibleError()
    onClose()
  }, [onClose, onDismissVisibleError])

  if (!productDetail) {
    return <ErrorAlert error={visibleError} onDismiss={handleDismissErrorAndClose} />
  }

  return (
    <>
      <LoadingIndicator loading={isLoading} />
      <ProductDetailScreen
        onClose={onClose}
        onOfferSelection={onOfferSelection}
        productDetail={productDetail}
        selectedOffer={selectedOffer}
        reserveProduct={reserveProduct}
      />
    </>
  )
}

export const ProductDetailRouteConfig = createRouteConfig({
  name: ProductDetailRouteName,
  component: ProductDetailRoute,
  options: { cardStyle: modalCardStyle },
})
