import React, { useCallback } from 'react'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { ModalScreenProps } from '../../../navigation/modal/types'
import { createRouteConfig } from '../../../navigation/utils/createRouteConfig'
import { Offer } from '../../../services/api/types/commerce/api-types'
import { modalCardStyle } from '../../../theme/utils'
import { useThumbnailImageUrl } from '../../../utils/image/hooks/use-thumbnail-image-url'
import { ProductDetailErrorAlert } from '../components/product-detail-error-alert'
import { useQueryProductDetail } from '../hooks/use-query-product-detail'
import { OfferSelectionScreen } from './offer-selection-screen'

export const OfferSelectionRouteName = 'OfferSelection'

export type OfferSelectionRouteParams = {
  productCode: string
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
        },
      })
    },
    [modalNavigation, productCode],
  )

  const { data: productDetail, error, isLoading } = useQueryProductDetail(productCode)

  const thumbnailImage = useThumbnailImageUrl(productDetail?.images)

  if (!productDetail?.offers) {
    return (
      <ProductDetailErrorAlert
        error="productDetail_getProductDetailError_message"
        visible={!isLoading && !!error}
        onClose={onClose}
      />
    )
  }

  return (
    <OfferSelectionScreen
      onClose={onClose}
      onBack={onBack}
      selectOffer={selectOffer}
      offers={productDetail.offers}
      thumbnailImageUrl={thumbnailImage?.imageUrl}
    />
  )
}

export const OfferSelectionRouteConfig = createRouteConfig({
  name: OfferSelectionRouteName,
  component: OfferSelectionRoute,
  options: { cardStyle: modalCardStyle },
})
