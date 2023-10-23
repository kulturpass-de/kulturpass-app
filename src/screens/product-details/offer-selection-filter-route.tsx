import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { LoadingIndicator } from '../../components/loading-indicator/loading-indicator'
import { ErrorAlert } from '../../features/form-validation/components/error-alert'
import { useGetLocationSuggestionsLazyQuery } from '../../features/product-detail/hooks/use-fetch-location-suggestions-lazy-query'
import { useQueryProductDetail } from '../../features/product-detail/hooks/use-query-product-detail'
import { getSelectedSuggestion } from '../../features/product-detail/redux/product-detail-selector'
import { isFiveDigitNumber } from '../../features/product-detail/utils'
import { PdpScreenProps, PdpParamList } from '../../navigation/pdp/types'
import { RootStackParams } from '../../navigation/types'
import { createRouteConfig } from '../../navigation/utils/create-route-config'
import { commerceApi } from '../../services/api/commerce-api'
import { GetProductDetailParams } from '../../services/api/types'
import { useDismissableError } from '../../services/errors/use-dismissable-error'
import { modalCardStyle } from '../../theme/utils'
import { useProductImageUrl } from '../../utils/image/hooks/use-product-image-url'
import { OfferSelectionFilterScreen } from './offer-selection-filter-screen'

export const OfferSelectionFilterRouteName = 'OfferSelectionFilter'

export type OfferSelectionFilterRouteParams = {
  productCode: string
  randomMode: boolean
  filterMode?: 'postalCode' | 'location'
  offersByLocation?: GetProductDetailParams['location']
}

type OfferSelectionFilterProps = PdpScreenProps<'OfferSelectionFilter'>

export const OfferSelectionFilterRoute: React.FC<OfferSelectionFilterProps> = ({ route }) => {
  const rootNavigation = useNavigation<StackNavigationProp<RootStackParams>>()
  const navigation = useNavigation<StackNavigationProp<PdpParamList>>()
  const { productCode, offersByLocation, randomMode } = route.params

  const onClose = useCallback(() => {
    rootNavigation.navigate('Tabs')
  }, [rootNavigation])

  const onBack = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  const { data: productDetail, error, isLoading } = useQueryProductDetail(route.params.productCode, offersByLocation)
  const [getIsValidPostalCode] = commerceApi.useLazyGetIsValidPostalCodeQuery()
  const fetchLocationSuggestions = useGetLocationSuggestionsLazyQuery()

  const selectedSuggestion = useSelector(getSelectedSuggestion)

  const productImage = useProductImageUrl(productDetail?.images, 'zoom')

  const { visibleError, onDismissVisibleError } = useDismissableError(!isLoading ? error : undefined)

  const onSubmitLocation = useCallback(() => {
    navigation.navigate('OfferSelection', {
      productCode,
      randomMode,
      offersByLocation: {
        provider: 'location',
      },
    })
  }, [navigation, productCode, randomMode])

  const onSubmitPostalCode = useCallback(
    (postalCodeOrCity: string) => {
      const isNotPostalCode = !isFiveDigitNumber(postalCodeOrCity) && selectedSuggestion

      if (isNotPostalCode) {
        navigation.navigate('OfferSelection', {
          productCode,
          randomMode,
          offersByLocation: {
            provider: 'city',
            location: selectedSuggestion,
          },
        })
      } else {
        navigation.navigate('OfferSelection', {
          productCode,
          randomMode,
          offersByLocation: {
            provider: 'postalCode',
            postalCode: postalCodeOrCity,
          },
        })
      }
    },
    [navigation, productCode, randomMode, selectedSuggestion],
  )

  return (
    <>
      <OfferSelectionFilterScreen
        defaultLocationProvider={offersByLocation}
        productImageUrl={productImage.imageUrl}
        onBack={onBack}
        onClose={onClose}
        onSubmitLocation={onSubmitLocation}
        onSubmitPostalCode={onSubmitPostalCode}
        getIsValidPostalCode={getIsValidPostalCode}
        fetchLocationSuggestions={fetchLocationSuggestions}
      />
      <LoadingIndicator loading={isLoading} />
      {visibleError ? <ErrorAlert error={visibleError} onDismiss={onDismissVisibleError} /> : null}
    </>
  )
}

export const OfferSelectionFilterRouteConfig = createRouteConfig({
  name: OfferSelectionFilterRouteName,
  component: OfferSelectionFilterRoute,
  options: { cardStyle: modalCardStyle },
})
