import debounce from 'lodash.debounce'
import { commerceApi } from '../../../services/api/commerce-api'
import {
  GetLocationSuggestionsParams,
  GetLocationSuggestionsResponse,
} from '../../../services/api/types/commerce/commerce-get-location-suggestions'
import { createThunk } from '../../../services/redux/utils/create-thunk'
import { productDetailSlice } from './product-detail-slice'

const DEBOUNCE_MS = 150

const debounceFn: () => typeof commerceApi.endpoints.getLocationSuggestions = debounce(
  () => commerceApi.endpoints.getLocationSuggestions,
  DEBOUNCE_MS,
  { leading: true, trailing: false },
)

/**
 * fetch location suggestions, save the results in the redux store and return the reponse
 */
export const productDetailLocationSuggestionThunk = createThunk<
  GetLocationSuggestionsResponse,
  GetLocationSuggestionsParams
>('productDetail/location/suggestions', async (payload, thunkAPI) => {
  const action = debounceFn().initiate(payload, { forceRefetch: true })

  const response = await thunkAPI.dispatch(action).unwrap()

  thunkAPI.dispatch(productDetailSlice.actions.setLocationSuggestions(response.results))

  return response
})
