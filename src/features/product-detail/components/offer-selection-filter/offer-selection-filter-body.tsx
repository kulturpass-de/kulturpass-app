import { LazyQueryTrigger } from '@reduxjs/toolkit/dist/query/react/buildHooks'
import React, { useCallback, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { TranslatedText } from '../../../../components/translated-text/translated-text'
import { commerceApi } from '../../../../services/api/commerce-api'
import { GetProductDetailParams } from '../../../../services/api/types'
import { GetLocationSuggestionsResponse } from '../../../../services/api/types/commerce/commerce-get-location-suggestions'
import { getCurrentUserLocation } from '../../../../services/location/redux/location-selectors'
import { useTestIdBuilder } from '../../../../services/test-id/test-id'
import { useTranslation } from '../../../../services/translation/translation'
import { useTheme } from '../../../../theme/hooks/use-theme'
import { spacing } from '../../../../theme/spacing'
import { useRequestLocationPopup } from '../../../location-sharing/hooks/use-location-popup'
import { getSelectedFilterType } from '../../redux/product-detail-selector'
import { productDetailSlice } from '../../redux/product-detail-slice'
import { isCityOrPostCode } from '../../types/product-detail'
import { Chip } from '../chip'
import { LocationSection } from './location-section'
import { PostalCodeSection } from './postal-code-section'

export type OfferSelectionFilterProps = {
  defaultLocationProvider?: GetProductDetailParams['location']
  productImageUrl?: string
  onClose: () => void
  onBack: () => void
  onSubmitLocation: () => void
  onSubmitPostalCode: (postalCode: string) => void
  getIsValidPostalCode: LazyQueryTrigger<typeof commerceApi.endpoints.getIsValidPostalCode.Types.QueryDefinition>
  fetchLocationSuggestions: ({ query }: { query: string }) => Promise<GetLocationSuggestionsResponse>
}

type OfferSelectionFilterBodyProps = Pick<
  OfferSelectionFilterProps,
  | 'onSubmitLocation'
  | 'defaultLocationProvider'
  | 'fetchLocationSuggestions'
  | 'getIsValidPostalCode'
  | 'onSubmitPostalCode'
> & {
  testID: string
}

export const OfferSelectionFilterBody: React.FC<OfferSelectionFilterBodyProps> = ({
  onSubmitLocation,
  getIsValidPostalCode,
  defaultLocationProvider,
  fetchLocationSuggestions,
  onSubmitPostalCode,
  testID,
}) => {
  const { t } = useTranslation()
  const { addTestIdModifier } = useTestIdBuilder()
  const { colors } = useTheme()

  const dispatch = useDispatch()
  const currentLocationAvailable = useSelector(getCurrentUserLocation) !== undefined
  const selectedFilterType = useSelector(getSelectedFilterType)

  const onLocationPopupFinished = useCallback(
    (isGranted: boolean) => {
      if (isGranted) {
        dispatch(productDetailSlice.actions.setSelectedFilterType('location'))
      }
    },
    [dispatch],
  )

  const openRequestLocationPopup = useRequestLocationPopup(onLocationPopupFinished)

  const onSelectLocation = useCallback(() => {
    if (!currentLocationAvailable) {
      openRequestLocationPopup()
    } else {
      dispatch(productDetailSlice.actions.setSelectedFilterType('location'))
    }
  }, [currentLocationAvailable, openRequestLocationPopup, dispatch])

  const onSelectPostalCode = useCallback(() => {
    dispatch(productDetailSlice.actions.setSelectedFilterType('postalCode'))
  }, [dispatch])

  useEffect(() => {
    if (defaultLocationProvider?.provider === 'city') {
      dispatch(productDetailSlice.actions.setShowSuggestions(false))
    }
  }, [dispatch, defaultLocationProvider])

  return (
    <View>
      <TranslatedText
        i18nKey="offerSelectionFilter_title"
        textStyleOverrides={[styles.title, { color: colors.labelColor }]}
        testID={addTestIdModifier(testID, 'title')}
        textStyle="HeadlineH4Extrabold"
      />
      <View style={[styles.chipContainer, { columnGap: spacing[3] }]}>
        <Chip
          testID={addTestIdModifier(testID, 'location_chip')}
          i18nKey="offerSelectionFilter_location"
          active={selectedFilterType === 'location'}
          onPress={onSelectLocation}
          accessible
          accessibilityRole="tab"
          accessibilityState={{ selected: selectedFilterType === 'location' }}
          accessibilityLabel={t('offerSelectionFilter_tab_location')}
        />
        <Chip
          testID={addTestIdModifier(testID, 'postalCodeOrCity_chip')}
          i18nKey="offerSelectionFilter_postalCode"
          active={isCityOrPostCode(selectedFilterType)}
          onPress={onSelectPostalCode}
          accessible
          accessibilityRole="tab"
          accessibilityState={{ selected: isCityOrPostCode(selectedFilterType) }}
          accessibilityLabel={t('offerSelectionFilter_tab_postalCode')}
        />
      </View>
      {selectedFilterType === 'location' && <LocationSection onSubmit={onSubmitLocation} testID={testID} />}
      {isCityOrPostCode(selectedFilterType) && (
        <PostalCodeSection
          onSubmit={onSubmitPostalCode}
          getIsValidPostalCode={getIsValidPostalCode}
          fetchLocationSuggestions={fetchLocationSuggestions}
          testID={testID}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  chipContainer: {
    flexDirection: 'row',
  },
  title: {
    marginTop: spacing[7],
    marginBottom: spacing[6],
  },
})
