import React, { useCallback } from 'react'
import { Screen } from '../../components/screen/screen'
import { ScreenHeader } from '../../components/screen/screen-header'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { FavoritesList, FavoritesListProps } from './favorites-list'
import { ErrorAlert } from '../../features/form-validation/components/error-alert'
import { LoadingIndicator } from '../../components/loading-indicator/loading-indicator'
import { useFavouritesOnFocus } from './use-favourites-on-focus'

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
        header={
          <ScreenHeader testID={buildTestId('favorites_headline')} title={t('favorites_headline')} borderBottom />
        }>
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
