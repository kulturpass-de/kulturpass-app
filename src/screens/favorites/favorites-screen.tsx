import React, { useCallback } from 'react'
import { LoadingIndicator } from '../../components/loading-indicator/loading-indicator'
import { Screen } from '../../components/screen/screen'
import { ScreenHeader } from '../../components/screen/screen-header'
import { FavoritesList, FavoritesListProps } from '../../features/favorites/components/favorites-list'
import { useFavouritesOnFocus } from '../../features/favorites/hooks/use-favourites-on-focus'
import { ErrorAlert } from '../../features/form-validation/components/error-alert'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'

export type FavoritesScreenProps = {
  onFavoritePressed: (productCode: string) => void
}

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({ onFavoritePressed }) => {
  const { t } = useTranslation()
  const { buildTestId } = useTestIdBuilder()

  const { favourites, reloadFavourites, isLoading, error, resetError } = useFavouritesOnFocus()

  const onProductPressed: NonNullable<FavoritesListProps['onProductPressed']> = useCallback(
    product => {
      onFavoritePressed(product.code!)
    },
    [onFavoritePressed],
  )

  return (
    <>
      <LoadingIndicator loading={isLoading && !error} />
      <ErrorAlert error={error} onDismiss={resetError} />
      <Screen
        testID={buildTestId('favorites')}
        header={<ScreenHeader testID={buildTestId('favorites_headline')} title={t('favorites_headline')} />}>
        <FavoritesList
          favourites={favourites}
          onProductPressed={onProductPressed}
          refreshing={isLoading}
          onRefresh={reloadFavourites}
        />
      </Screen>
    </>
  )
}
