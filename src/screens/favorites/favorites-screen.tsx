import React from 'react'

import { Screen } from '../../components/screen/screen'

import { ScreenHeader } from '../../components/screen/screen-header'
import { commerceApi } from '../../services/api/commerce-api'

import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { FavoritesEmptyScreen } from './favorites-empty-screen'
import { FavoritesList } from './favorites-list'

export type FavoritesScreenProps = {}

export const FavoritesScreen: React.FC<FavoritesScreenProps> = () => {
  const { t } = useTranslation()
  const { buildTestId } = useTestIdBuilder()

  const { data } = commerceApi.useGetFavoritesQuery()

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
