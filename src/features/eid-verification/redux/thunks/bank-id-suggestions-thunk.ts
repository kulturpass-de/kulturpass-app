import debounce from 'lodash.debounce'
import { commerceApi } from '../../../../services/api/commerce-api'
import {
  BankIdSuggestionsParams,
  BankIdSuggestionsResponse,
} from '../../../../services/api/types/commerce/commerce-get-bank-id-suggestions'
import { createThunk } from '../../../../services/redux/utils/create-thunk'

const DEBOUNCE_MS = 150

const debounceFn: () => typeof commerceApi.endpoints.getBankIdSuggestions = debounce(
  () => commerceApi.endpoints.getBankIdSuggestions,
  DEBOUNCE_MS,
  { leading: true, trailing: false },
)

export const bankIdSuggestionsThunk = createThunk<BankIdSuggestionsResponse, BankIdSuggestionsParams>(
  'identification/bankId/suggestions',
  async (payload, thunkAPI) => {
    const action = debounceFn().initiate(payload, { forceRefetch: true })

    const response = await thunkAPI.dispatch(action).unwrap()

    return response
  },
)
