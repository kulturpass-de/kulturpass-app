import { commerceApi } from '../../services/api/commerce-api'

export const useIsFavorite = (productCode?: string) => {
  // refetchOnMountOrArgChange is necessary because we don't register
  // when the user favorites/unfavorites items in the webview
  const { data } = commerceApi.useGetFavoritesQuery(undefined, { refetchOnMountOrArgChange: true })
  return data?.favouritesItems?.some(item => item.product?.code === productCode)
}
