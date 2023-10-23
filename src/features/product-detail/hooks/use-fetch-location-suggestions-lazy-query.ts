import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../services/redux/configure-store'
import { productDetailLocationSuggestionThunk } from '../redux/product-detail-location-suggestions-thunk'

export const useGetLocationSuggestionsLazyQuery = () => {
  const dispatch = useDispatch<AppDispatch>()

  const cb = useCallback(
    ({ query }: { query: string }) => {
      return dispatch(productDetailLocationSuggestionThunk({ query })).unwrap()
    },
    [dispatch],
  )

  return cb
}
