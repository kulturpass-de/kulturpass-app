import { useFocusEffect } from '@react-navigation/native'
import React from 'react'
import { FavoriteButton } from '../../../components/favorite-button/favorite-button'
import { buildTestId } from '../../../services/test-id/test-id'
import { HITSLOP_FAVORITES_LIST_ITEM } from '../../../theme/constants'
import { useFavouritesListItemActions } from '../../favorites/hooks/use-favourites-list-item-actions'
import { useIsFavorite } from '../../favorites/hooks/use-is-favorite'
import { ErrorAlert } from '../../form-validation/components/error-alert'

export type ProductDetailFooterFavoriteButtonProps = {
  productCode?: string
  size?: number
}

export const ProductDetailFooterFavoriteButton = ({ productCode, size }: ProductDetailFooterFavoriteButtonProps) => {
  const { isFavorite: defaultIsFavorite, refetch } = useIsFavorite(productCode)
  const { toggleIsFavourite, isFavorite, error, resetError } = useFavouritesListItemActions(
    productCode,
    defaultIsFavorite ?? false,
  )

  useFocusEffect(refetch)

  return (
    <>
      <FavoriteButton
        isFavorite={isFavorite ?? false}
        hitSlop={HITSLOP_FAVORITES_LIST_ITEM}
        testID={buildTestId('productDetail_footer_favorite_button')}
        onPress={toggleIsFavourite}
        size={size}
      />
      <ErrorAlert error={error} onDismiss={resetError} />
    </>
  )
}
