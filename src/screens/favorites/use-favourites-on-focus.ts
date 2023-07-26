import { useFocusEffect } from '@react-navigation/native'
import { useState, useCallback, useRef, useMemo } from 'react'
import { ErrorAlertError } from '../../features/form-validation/components/error-alert'
import { commerceApi } from '../../services/api/commerce-api'
import { FavouritesEntry } from '../../services/api/types/commerce/api-types'

export type UseFavouritesOnFocusResult = {
  favourites: FavouritesEntry[]
  reloadFavourites: () => Promise<void>
  isLoading: boolean
  error: ErrorAlertError | undefined
  resetError: () => void
}

export const useFavouritesOnFocus = (): UseFavouritesOnFocusResult => {
  const reloadOnFocus = useRef(true)
  const [error, setError] = useState<ErrorAlertError>()
  const [loadFavourites, { data, isLoading }] = commerceApi.useLazyGetFavoritesQuery()

  const favourites = useMemo(() => {
    const sortedFavorites = data?.favouritesItems ? [...data.favouritesItems] : []
    sortedFavorites.sort((f1, f2) => (f1.entryNumber ?? 0) - (f2.entryNumber ?? 0))
    return sortedFavorites.filter(favorite => !!favorite.product)
  }, [data])

  const reloadFavourites = useCallback(
    async (preferCacheValue = false) => {
      const { error: currentError } = await loadFavourites(undefined, preferCacheValue)
      if (currentError) {
        setError(currentError)
      }
    },
    [loadFavourites],
  )

  useFocusEffect(
    useCallback(() => {
      if (reloadOnFocus.current && !error) {
        reloadFavourites()
      }
    }, [reloadOnFocus, error, reloadFavourites]),
  )

  const resetError = useCallback((disableReloadOnFocus = true) => {
    reloadOnFocus.current = !disableReloadOnFocus
    setError(undefined)
  }, [])

  return {
    favourites,
    reloadFavourites,
    isLoading,
    error,
    resetError,
  }
}
