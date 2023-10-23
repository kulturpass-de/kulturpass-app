import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { LoadingIndicator } from '../../components/loading-indicator/loading-indicator'
import { ErrorAlert } from '../../features/form-validation/components/error-alert'
import { useQueryProductDetail } from '../../features/product-detail/hooks/use-query-product-detail'
import { productDetailSlice } from '../../features/product-detail/redux/product-detail-slice'
import { PdpParamList, PdpScreenProps } from '../../navigation/pdp/types'
import { RootStackParams } from '../../navigation/types'
import { createRouteConfig } from '../../navigation/utils/create-route-config'
import { GetProductDetailParams } from '../../services/api/types'
import { Offer } from '../../services/api/types/commerce/api-types'
import { useDismissableError } from '../../services/errors/use-dismissable-error'
import { modalCardStyle } from '../../theme/utils'
import { useProductImageUrl } from '../../utils/image/hooks/use-product-image-url'
import { OfferSelectionScreen } from './offer-selection-screen'

export const OfferSelectionRouteName = 'OfferSelection'

export type OfferSelectionRouteParams = {
  productCode: string
  randomMode: boolean
  filterMode?: 'postalCode' | 'location'
  offersByLocation?: GetProductDetailParams['location']
}

type OfferSelectionProps = PdpScreenProps<'OfferSelection'>

export const OfferSelectionRoute: React.FC<OfferSelectionProps> = ({ route }) => {
  const dispatch = useDispatch()
  const rootNavigation = useNavigation<StackNavigationProp<RootStackParams>>()
  const navigation = useNavigation<StackNavigationProp<PdpParamList>>()
  const { productCode, offersByLocation, randomMode } = route.params

  const onClose = useCallback(() => {
    rootNavigation.navigate('Tabs')
  }, [rootNavigation])

  const onBack = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  const selectOffer = useCallback(
    (offerId: Offer['id']) => {
      navigation.navigate('ProductDetail', {
        productCode,
        offerId,
        randomMode,
        offersByLocation,
      })
    },
    [navigation, productCode, randomMode, offersByLocation],
  )

  const onPressFilter = useCallback(() => {
    navigation.navigate('OfferSelectionFilter', {
      productCode: productCode,
      offersByLocation,
      randomMode,
    })
  }, [navigation, productCode, offersByLocation, randomMode])

  const { data: productDetail, error, isLoading } = useQueryProductDetail(productCode, offersByLocation)

  const productImage = useProductImageUrl(productDetail?.images, 'zoom')

  const { visibleError, onDismissVisibleError } = useDismissableError(!isLoading ? error : undefined)

  useEffect(() => {
    return () => {
      dispatch(productDetailSlice.actions.resetInitialState())
    }
  }, [dispatch])

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
        fulfillmentOption={productDetail.fulfillmentOption}
        offers={productDetail.offers}
        productImageUrl={productImage?.imageUrl}
        onPressFilter={onPressFilter}
        offersByLocation={offersByLocation}
      />
    </>
  )
}

export const OfferSelectionRouteConfig = createRouteConfig({
  name: OfferSelectionRouteName,
  component: OfferSelectionRoute,
  options: { cardStyle: modalCardStyle },
})
