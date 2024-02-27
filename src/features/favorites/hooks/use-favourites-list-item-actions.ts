import debounce from 'lodash.debounce'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { commerceApi } from '../../../services/api/commerce-api'
import { HttpServerError } from '../../../services/errors/errors'

export const useFavouritesListItemActions = (productCode?: string, defaultIsFavorite: boolean = true) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(defaultIsFavorite)
  const [addProductToCart, addProductToCartDetails] = commerceApi.useAddProductToCartMutation()
  const [removeProductFromCart, removeProductFromCartDetails] = commerceApi.useRemoveProductFromCartMutation()

  useEffect(() => {
    setIsFavorite(defaultIsFavorite)
  }, [defaultIsFavorite])

  const removeFromFavorites = useMemo(
    () =>
      debounce(
        async () => {
          setIsFavorite(false)

          try {
            if (productCode === undefined) {
              return
            }

            await removeProductFromCart({ productCode }).unwrap()
          } catch (err) {
            // we need to assume that the product is already removed, otherwise the state would never change
            if ((err as HttpServerError)?.statusCode !== 400) {
              setIsFavorite(true)
            }
          }
        },
        300,
        { leading: true, trailing: false },
      ),
    [productCode, removeProductFromCart],
  )

  const addToFavourites = useMemo(
    () =>
      debounce(
        async () => {
          setIsFavorite(true)

          try {
            if (productCode === undefined) {
              return
            }

            await addProductToCart({ productCode }).unwrap()
          } catch (err) {
            if ((err as HttpServerError)?.statusCode !== 400) {
              setIsFavorite(false)
            }
          }
        },
        300,
        { leading: true, trailing: false },
      ),
    [productCode, addProductToCart],
  )

  const toggleIsFavourite = useCallback(async () => {
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
