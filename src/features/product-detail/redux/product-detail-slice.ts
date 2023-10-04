import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LocationSuggestion } from '../../../services/api/types/commerce/commerce-get-location-suggestions'
import { SelectedFilterType } from '../types/product-detail'

export type ProductDetailState = {
  showSuggestions: boolean
  selectedSuggestion?: LocationSuggestion
  selectedFilterType: SelectedFilterType
  userEnteredCityPostalCode: string
  locationSuggestions: null | Array<LocationSuggestion>
  defaultPostalCodeOrCity?: string
}

const initialState: ProductDetailState = {
  showSuggestions: false,
  selectedSuggestion: undefined,
  selectedFilterType: 'location',
  userEnteredCityPostalCode: '',
  locationSuggestions: null,
  defaultPostalCodeOrCity: undefined,
}

export const productDetailSlice = createSlice({
  name: 'productDetail',
  initialState,
  reducers: {
    resetInitialState: () => ({
      ...initialState,
    }),
    /** clear button, just keep the filter/tab state */
    resetSelectedSuggestion: state => ({
      ...initialState,
      selectedFilterType: state.selectedFilterType,
    }),
    setLocationSuggestions: (state, action: PayloadAction<ProductDetailState['locationSuggestions']>) => {
      state.locationSuggestions = action.payload
    },
    setUserEnteredCityPostalCode: (state, action: PayloadAction<ProductDetailState['userEnteredCityPostalCode']>) => {
      state.userEnteredCityPostalCode = action.payload
    },
    setShowSuggestions: (state, action: PayloadAction<ProductDetailState['showSuggestions']>) => {
      state.showSuggestions = action.payload
    },
    setSelectedSuggestion: (state, action: PayloadAction<ProductDetailState['selectedSuggestion']>) => {
      state.selectedSuggestion = action.payload
      state.showSuggestions = false
    },
    setSelectedFilterType: (state, action: PayloadAction<ProductDetailState['selectedFilterType']>) => {
      state.selectedFilterType = action.payload
    },
    setDefaultPostalCodeOrCity: (state, action: PayloadAction<ProductDetailState['defaultPostalCodeOrCity']>) => {
      state.defaultPostalCodeOrCity = action.payload
    },
  },
})
