import { useCallback } from 'react'
import { commerceApi } from '../../services/api/commerce-api'

export const useIsFavorite = (productCode?: string) => {
  // when the user favorites/unfavorites items in the webview, we need to
  // know the current state on the pdp, so a refetch is necessary
  const [queryTrigger, { data }] = commerceApi.useLazyGetFavoritesQuery(undefined)

  const refetch = useCallback(() => {
    queryTrigger()
  }, [queryTrigger])

  return { isFavorite: data?.favouritesItems?.some(item => item.product?.code === productCode), refetch }
}
