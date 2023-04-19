import React from 'react'
import { useSelector } from 'react-redux'

import { Screen } from '../../components/screen/screen'

import { ScreenHeader } from '../../components/screen/screen-header'
import { commerceApi } from '../../services/api/commerce-api'

import { getCommerceBaseSiteId } from '../../services/environment-configuration/redux/environment-configuration-selectors'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { FavoritesEmptyScreen } from './favorites-empty-screen'
import { FavoritesList } from './favorites-list'

export type FavoritesScreenProps = {}

export const FavoritesScreen: React.FC<FavoritesScreenProps> = () => {
  const { t } = useTranslation()
  const { buildTestId } = useTestIdBuilder()

  const baseSiteId = useSelector(getCommerceBaseSiteId)

  const { data } = commerceApi.endpoints.getFavorites.useQuery({ baseSiteId })

  const wishlist = data?.carts?.[0] ?? null
  const wishlistProducts = wishlist?.entries ?? []

  if (wishlistProducts.length === 0) {
    return <FavoritesEmptyScreen />
  }

  return (
    <Screen
      testID={buildTestId('favorites')}
      header={<ScreenHeader testID={buildTestId('favorites_headline')} title={t('favorites_headline')} borderBottom />}>
      <FavoritesList orderEntries={wishlistProducts} />
    </Screen>
  )
}
