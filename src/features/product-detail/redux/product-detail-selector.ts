import { createSelector } from '@reduxjs/toolkit'
import { type RootState } from '../../../services/redux/configure-store'
import { isCityOrPostCode } from '../types/product-detail'
import { isValidLocationSuggestionString } from '../utils'

export const getShowSuggestions = (state: RootState) => state.productDetail.showSuggestions

export const getSelectedSuggestion = (state: RootState) => state.productDetail.selectedSuggestion

export const getSelectedFilterType = (state: RootState) => state.productDetail.selectedFilterType

export const getUserEnteredCityPostalCode = (state: RootState) => state.productDetail.userEnteredCityPostalCode

export const getLocationSuggestions = (state: RootState) => state.productDetail.locationSuggestions

export const getDefaultSelection = (state: RootState) => state.productDetail.defaultSelection

export const getLocationSuggestionsLength = createSelector(
  getLocationSuggestions,
  locationSuggestions => locationSuggestions?.length ?? null,
)

/**
 * returns true if the suggestions should be shown, else false
 * this can be influenced by input focus, input type (city or postal code), input length and API response
 */
export const getSuggestionsVisible = createSelector(
  getSelectedFilterType,
  getShowSuggestions,
  getUserEnteredCityPostalCode,
  getLocationSuggestions,
  (selectedFilterType, showSuggestions, userEnteredPostalCode, locationSuggestions) =>
    isCityOrPostCode(selectedFilterType) &&
    showSuggestions &&
    isValidLocationSuggestionString(userEnteredPostalCode) &&
    Array.isArray(locationSuggestions),
)
