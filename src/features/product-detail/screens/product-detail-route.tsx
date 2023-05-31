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
import { commerceApi } from '../../../services/api/commerce-api'

export const ProductDetailRouteName = 'ProductDetail'

export type ProductDetailRouteParams = {
  productCode: string
  randomMode: boolean
  offerId?: Offer['id']
}

type ProfileScreenProps = ModalScreenProps<'ProductDetail'>

export const ProductDetailRoute: React.FC<ProfileScreenProps> = ({ route, navigation }) => {
  const modalNavigation = useModalNavigation()
  const { productCode, offerId, randomMode } = route.params

  const [randomProductQueryTrigger, randomProductResult] = commerceApi.useLazyGetRandomProductQuery()

  const onClose = useCallback(() => {
    modalNavigation.closeModal()
  }, [modalNavigation])

  const onRandomReroll = useCallback(async () => {
    const randomProduct = await randomProductQueryTrigger({}).unwrap()
    navigation.setParams({
      productCode: randomProduct.code,
      randomMode: true,
    })
  }, [navigation, randomProductQueryTrigger])

  const onOfferSelection = useCallback(() => {
    modalNavigation.navigate({ screen: 'OfferSelection', params: { productCode, randomMode } })
  }, [modalNavigation, productCode, randomMode])

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

  const { visibleError, onDismissVisibleError } = useDismissableError(
    !isLoading ? error ?? randomProductResult.error : undefined,
  )

  const handleDismissErrorAndClose = useCallback(() => {
    onDismissVisibleError()
    onClose()
  }, [onClose, onDismissVisibleError])

  return (
    <>
      <LoadingIndicator loading={isLoading || randomProductResult.isLoading} />
      <ErrorAlert error={visibleError} onDismiss={handleDismissErrorAndClose} />
      {productDetail ? (
        <ProductDetailScreen
          onClose={onClose}
          onOfferSelection={onOfferSelection}
          onRandomReroll={onRandomReroll}
          productDetail={productDetail}
          selectedOffer={selectedOffer}
          randomMode={randomMode}
          reserveProduct={reserveProduct}
        />
      ) : null}
    </>
  )
}

export const ProductDetailRouteConfig = createRouteConfig({
  name: ProductDetailRouteName,
  component: ProductDetailRoute,
  options: { cardStyle: modalCardStyle },
})
