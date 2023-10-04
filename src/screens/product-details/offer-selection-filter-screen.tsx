import React, { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Keyboard, ListRenderItemInfo, ScrollView, StyleSheet, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { ModalScreen } from '../../components/modal-screen/modal-screen'
import {
  OfferSelectionFilterBody,
  OfferSelectionFilterProps,
} from '../../features/product-detail/components/offer-selection-filter/offer-selection-filter-body'
import { OfferSelectionFilterSuggestionsItem } from '../../features/product-detail/components/offer-selection-filter/offer-selection-filter-suggestions-item'
import { OfferSelectionFilterSuggestionsItemEmpty } from '../../features/product-detail/components/offer-selection-filter/offer-selection-filter-suggestions-item-empty'
import { OfferSelectionFilterSuggestionsItemSeparator } from '../../features/product-detail/components/offer-selection-filter/offer-selection-filter-suggestions-item-separator'
import { OfferSelectionHeader } from '../../features/product-detail/components/offer-selection-header'
import {
  getLocationSuggestionsLength,
  getLocationSuggestions,
  getSelectedFilterType,
  getSuggestionsVisible,
} from '../../features/product-detail/redux/product-detail-selector'
import { productDetailSlice } from '../../features/product-detail/redux/product-detail-slice'
import { LocationSuggestion } from '../../services/api/types/commerce/commerce-get-location-suggestions'
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
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const testID = buildTestId('offerSelectionFilter')
  const { t } = useTranslation()

  const dispatch = useDispatch()

  const keyExtractor = useCallback((item: LocationSuggestion) => `${item.id}-${item.latitude}`, [])

  const suggestionsLength: number | null = useSelector(getLocationSuggestionsLength)
  const suggestions = useSelector(getLocationSuggestions)
  const selectedFilterType = useSelector(getSelectedFilterType)

  const renderItem = useCallback(
    (info: ListRenderItemInfo<LocationSuggestion>) => (
      <OfferSelectionFilterSuggestionsItem
        testID={addTestIdModifier(testID, 'suggestions_item')}
        topRadius={info.index === 0}
        bottomRadius={info.index >= (suggestionsLength ?? 0) - 1}
        name={info.item.name}
        accessibilityHint={t('offerSelectionFilter_suggestions_item_accessibility_hint', {
          position: info.index + 1,
          total: suggestionsLength ?? info.index + 1,
        })}
        // eslint-disable-next-line react/jsx-no-bind
        onPress={() => {
          Keyboard.dismiss()
          dispatch(productDetailSlice.actions.setSelectedSuggestion(info.item))
        }}
      />
    ),
    [suggestionsLength, dispatch, t, testID, addTestIdModifier],
  )

  const suggestionsVisible = useSelector(getSuggestionsVisible)

  useEffect(() => {
    if (selectedFilterType === 'city' || selectedFilterType === 'location') {
      dispatch(productDetailSlice.actions.setShowSuggestions(false))
    }
  }, [selectedFilterType, dispatch])

  useEffect(() => {
    dispatch(productDetailSlice.actions.setSelectedFilterType(defaultLocationProvider?.provider ?? 'postalCode'))

    if (defaultLocationProvider?.provider === 'city' || defaultLocationProvider?.provider === 'postalCode') {
      const defaultValue =
        defaultLocationProvider.provider === 'city'
          ? defaultLocationProvider.location.name
          : defaultLocationProvider.postalCode

      dispatch(productDetailSlice.actions.setDefaultPostalCodeOrCity(defaultValue))
    } else {
      dispatch(
        productDetailSlice.actions.setDefaultPostalCodeOrCity(
          productDetailSlice.getInitialState().defaultPostalCodeOrCity,
        ),
      )
    }
  }, [dispatch, defaultLocationProvider])

  return (
    <ModalScreen testID={testID}>
      <OfferSelectionHeader imageUrl={productImageUrl} onClose={onClose} onBack={onBack} />

      <ScrollView bounces={false} contentContainerStyle={styles.scrollContent} style={styles.scrollContainer}>
        <OfferSelectionFilterBody
          testID={testID}
          onSubmitLocation={onSubmitLocation}
          defaultLocationProvider={defaultLocationProvider}
          getIsValidPostalCode={getIsValidPostalCode}
          fetchLocationSuggestions={fetchLocationSuggestions}
          onSubmitPostalCode={onSubmitPostalCode}
        />
      </ScrollView>

      {suggestionsVisible && suggestionsLength === 0 ? (
        <View style={styles.scrollContent}>
          <OfferSelectionFilterSuggestionsItemEmpty testID={addTestIdModifier(testID, 'suggestions_item_empty')} />
        </View>
      ) : null}

      {suggestionsVisible && suggestionsLength !== null && suggestionsLength > 0 ? (
        <FlatList
          testID={addTestIdModifier(testID, 'suggestions_list')}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          data={suggestionsVisible ? suggestions : []}
          bounces={false}
          keyboardShouldPersistTaps="handled"
          style={styles.flatListContainer}
          keyExtractor={keyExtractor}
          ItemSeparatorComponent={OfferSelectionFilterSuggestionsItemSeparator}
          renderItem={renderItem}
        />
      ) : null}
    </ModalScreen>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: spacing[5],
  },
  scrollContainer: {
    flexGrow: 0,
  },
  flatListContainer: {
    width: '100%',
    flex: 1,
  },
})
