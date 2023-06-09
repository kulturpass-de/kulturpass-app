import React, { useCallback } from 'react'
import { LoadingIndicator } from '../../../components/loading-indicator/loading-indicator'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { ModalScreenProps } from '../../../navigation/modal/types'
import { createRouteConfig } from '../../../navigation/utils/createRouteConfig'
import { Offer } from '../../../services/api/types/commerce/api-types'
import { useDismissableError } from '../../../services/errors/use-dismissable-error'
import { modalCardStyle } from '../../../theme/utils'
import { useProductImageUrl } from '../../../utils/image/hooks/use-product-image-url'
import { ErrorAlert } from '../../form-validation/components/error-alert'
import { useQueryProductDetail } from '../hooks/use-query-product-detail'
import { OfferSelectionScreen } from './offer-selection-screen'

export const OfferSelectionRouteName = 'OfferSelection'

export type OfferSelectionRouteParams = {
  productCode: string
  randomMode: boolean
}

type OfferSelectionProps = ModalScreenProps<'OfferSelection'>

export const OfferSelectionRoute: React.FC<OfferSelectionProps> = ({ route }) => {
  const modalNavigation = useModalNavigation()
  const productCode = route.params.productCode

  const onClose = useCallback(() => {
    modalNavigation.closeModal()
  }, [modalNavigation])

  const onBack = useCallback(() => {
    modalNavigation.goBack()
  }, [modalNavigation])

  const selectOffer = useCallback(
    (offerId: Offer['id']) => {
      modalNavigation.navigate({
        screen: 'ProductDetail',
        params: {
          productCode,
          offerId,
          randomMode: route.params.randomMode,
        },
      })
    },
    [modalNavigation, productCode, route.params.randomMode],
  )

  const { data: productDetail, error, isLoading } = useQueryProductDetail(productCode)

  const productImage = useProductImageUrl(productDetail?.images, 'zoom')

  const { visibleError, onDismissVisibleError } = useDismissableError(!isLoading ? error : undefined)

  if (!productDetail?.offers) {
    return <ErrorAlert error={visibleError} onDismiss={onDismissVisibleError} />
  }

  return (
    <>
      <LoadingIndicator loading={isLoading} />
      <OfferSelectionScreen
        onClose={onClose}
        onBack={onBack}
        selectOffer={selectOffer}
        offers={productDetail.offers}
        productImageUrl={productImage?.imageUrl}
      />
    </>
  )
}

export const OfferSelectionRouteConfig = createRouteConfig({
  name: OfferSelectionRouteName,
  component: OfferSelectionRoute,
  options: { cardStyle: modalCardStyle },
})
