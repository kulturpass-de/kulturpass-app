import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { ModalScreen } from '../../components/modal-screen/modal-screen'
import {
  OfferSelectionFilterBody,
  OfferSelectionFilterProps,
} from '../../features/product-detail/components/offer-selection-filter/offer-selection-filter-body'
import { OfferSelectionHeader } from '../../features/product-detail/components/offer-selection-header'
import { getSelectedFilterType } from '../../features/product-detail/redux/product-detail-selector'
import { productDetailSlice } from '../../features/product-detail/redux/product-detail-slice'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { spacing } from '../../theme/spacing'

export const OfferSelectionFilterScreen: React.FC<OfferSelectionFilterProps> = ({
  defaultLocationProvider,
  onClose,
  onBack,
  productImageUrl,
  onSubmitLocation,
  onSubmitPostalCode,
  getIsValidPostalCode,
  fetchLocationSuggestions,
}) => {
  const { buildTestId } = useTestIdBuilder()
  const testID = buildTestId('offerSelectionFilter')

  const dispatch = useDispatch()

  const selectedFilterType = useSelector(getSelectedFilterType)

  useEffect(() => {
    if (selectedFilterType === 'city' || selectedFilterType === 'location') {
      dispatch(productDetailSlice.actions.setShowSuggestions(false))
    }
  }, [selectedFilterType, dispatch])

  useEffect(() => {
    dispatch(productDetailSlice.actions.setSelectedFilterType(defaultLocationProvider?.provider ?? 'postalCode'))

    if (defaultLocationProvider?.provider === 'city') {
      dispatch(productDetailSlice.actions.setDefaultSelection(defaultLocationProvider.location))
    } else if (defaultLocationProvider?.provider === 'postalCode') {
      dispatch(productDetailSlice.actions.setDefaultSelection(defaultLocationProvider.postalCode))
    } else {
      dispatch(productDetailSlice.actions.setDefaultSelection(productDetailSlice.getInitialState().defaultSelection))
    }
  }, [dispatch, defaultLocationProvider])

  return (
    <ModalScreen testID={testID}>
      <OfferSelectionHeader imageUrl={productImageUrl} onClose={onClose} onBack={onBack} />

      <View style={styles.content}>
        <OfferSelectionFilterBody
          testID={testID}
          onSubmitLocation={onSubmitLocation}
          defaultLocationProvider={defaultLocationProvider}
          getIsValidPostalCode={getIsValidPostalCode}
          fetchLocationSuggestions={fetchLocationSuggestions}
          onSubmitPostalCode={onSubmitPostalCode}
        />
      </View>
    </ModalScreen>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing[5],
  },
})
