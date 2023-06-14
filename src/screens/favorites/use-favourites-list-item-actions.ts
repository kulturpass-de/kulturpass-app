import { useCallback, useState } from 'react'

import { commerceApi } from '../../services/api/commerce-api'
import { FavouritesItem, Product } from '../../services/api/types/commerce/api-types'

export type UseFavouritesListItemActionsParams = {
  cartId: FavouritesItem['cartId']
  productCode: Product['code']
}

export const useFavouritesListItemActions = ({ cartId, productCode }: UseFavouritesListItemActionsParams) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(true)
  const [getFavorites] = commerceApi.useLazyGetFavoritesQuery()
  const [removeProductFromCart, { error, reset: resetError }] = commerceApi.useRemoveProductFromCartMutation()

  const removeFromFavorites = useCallback(async () => {
    setIsFavorite(false)

    try {
      /**
       * In order to remove an item from favourites, we need to do so by giving its entryNumber in the api call. That
       * entryNumber is "dynamic" and changes upon every favourite removal, meaning that every consequent request to
       * remove a favourite will fail.
       *
       * For that reason we "index" the favourites with the product.code, and before doing the favourite removal, we
       * refetch the favourites just to make sure that have the item's update entryNumber.
       *
       * Another solution would be to just refresh the favourites after the removal of one, but the refetch is much
       * faster than the actual database deletion, meaning that we have to setTimeout before the refetch, not a clean
       * solution.
       */
      const favorites = await getFavorites(undefined, false)
      const favorite = favorites.data?.favouritesItems.find(
        currentFavorite => currentFavorite.product.code === productCode,
      )

      if (!favorite) {
        return
      }

      await removeProductFromCart({ cartId, entryNumber: favorite.entryNumber }).unwrap()
    } catch (err) {
      setIsFavorite(true)
    }
  }, [getFavorites, productCode, removeProductFromCart, cartId])

  const addToFavourites = useCallback(async () => {
    setIsFavorite(true)

    try {
      // NOTE: no api call is available to execute this action
      throw productCode
    } catch (err) {
      setIsFavorite(false)
    }
  }, [productCode])

  const toggleIsFavourite = useCallback(() => {
    if (isFavorite) {
      return removeFromFavorites()
    } else {
      return addToFavourites()
    }
  }, [isFavorite, removeFromFavorites, addToFavourites])

  return {
    isFavorite,
    removeFromFavorites,
    addToFavourites,
    toggleIsFavourite,
    error,
    resetError,
  }
}
