import { useCallback, useEffect, useState } from 'react'
import { commerceApi } from '../../services/api/commerce-api'

export const useFavouritesListItemActions = (productCode?: string, defaultIsFavorite: boolean = true) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(defaultIsFavorite)
  const [addProductToCart, addProductToCartDetails] = commerceApi.useAddProductToCartMutation()
  const [removeProductFromCart, removeProductFromCartDetails] = commerceApi.useRemoveProductFromCartMutation()

  useEffect(() => {
    setIsFavorite(defaultIsFavorite)
  }, [defaultIsFavorite])

  const removeFromFavorites = useCallback(async () => {
    setIsFavorite(false)

    try {
      if (productCode === undefined) {
        return
      }

      await removeProductFromCart({ productCode }).unwrap()
    } catch (err) {
      setIsFavorite(true)
    }
  }, [productCode, removeProductFromCart])

  const addToFavourites = useCallback(async () => {
    setIsFavorite(true)

    try {
      if (productCode === undefined) {
        return
      }

      await addProductToCart({ productCode })
    } catch (err) {
      setIsFavorite(false)
    }
  }, [productCode, addProductToCart])

  const toggleIsFavourite = useCallback(() => {
    if (isFavorite) {
      return removeFromFavorites()
    } else {
      return addToFavourites()
    }
  }, [isFavorite, removeFromFavorites, addToFavourites])

  const resetError = useCallback(() => {
    addProductToCartDetails.reset()
    removeProductFromCartDetails.reset()
  }, [addProductToCartDetails, removeProductFromCartDetails])

  return {
    isFavorite,
    removeFromFavorites,
    addToFavourites,
    toggleIsFavourite,
    error: addProductToCartDetails.error ?? removeProductFromCartDetails.error,
    resetError,
  }
}
