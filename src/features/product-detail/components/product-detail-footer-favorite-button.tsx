import React from 'react'
import { FavoriteButton } from '../../../components/favorite-button/favorite-button'
import { useFavouritesListItemActions } from '../../../screens/favorites/use-favourites-list-item-actions'
import { useIsFavorite } from '../../../screens/favorites/use-is-favorite'
import { buildTestId } from '../../../services/test-id/test-id'
import { HITSLOP_FAVORITES_LIST_ITEM } from '../../../theme/constants'
import { ErrorAlert } from '../../form-validation/components/error-alert'

export type ProductDetailFooterFavoriteButtonProps = {
  productCode?: string
}

export const ProductDetailFooterFavoriteButton = ({ productCode }: ProductDetailFooterFavoriteButtonProps) => {
  const isFavorite = useIsFavorite(productCode)
  const { toggleIsFavourite, error, resetError } = useFavouritesListItemActions(productCode)

  return (
    <>
      <FavoriteButton
        isFavorite={isFavorite ?? false}
        hitSlop={HITSLOP_FAVORITES_LIST_ITEM}
        testID={buildTestId('productDetail_footer_favorite_button')}
        onPress={toggleIsFavourite}
      />
      <ErrorAlert error={error} onDismiss={resetError} />
    </>
  )
}
