import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { BankIdSuggestion } from '../../../services/api/types/commerce/commerce-get-bank-id-suggestions'
import { AppDispatch } from '../../../services/redux/configure-store'
import { bankIdSuggestionsThunk } from '../redux/thunks/bank-id-suggestions-thunk'

export const useGetBankSuggestionsLazyQuery = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [bankSuggestions, setBankSuggestions] = useState<BankIdSuggestion[] | null>(null)

  const fetchBankSuggestions = useCallback(
    async ({ query }: { query: string }) => {
      const result = await dispatch(bankIdSuggestionsThunk({ query })).unwrap()
      setBankSuggestions(result.results)
      return result.results
    },
    [dispatch],
  )

  return { bankSuggestions, fetchBankSuggestions }
}
