import React, { useCallback, useEffect, useState } from 'react'
import { Pressable, PressableProps } from 'react-native'
import { ErrorAlert } from '../../features/form-validation/components/error-alert'
import { commerceApi } from '../../services/api/commerce-api'
import { TestId } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { Icon } from '../icon/icon'
import { FavouritesItem, Product } from '../../services/api/types/commerce/api-types'
import { HITSLOP } from '../../theme/constants'

export type FavoriteButtonProps = {
  cartId: FavouritesItem['cartId']
  productCode: Product['code']
  active: boolean
  testID: TestId
  hitSlop?: PressableProps['hitSlop']
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  cartId,
  productCode,
  active,
  testID,
  ...pressableProps
}) => {
  const { t } = useTranslation()
  const [isFavorite, setIsFavorite] = useState<boolean>(active)
  const [getFavorites] = commerceApi.useLazyGetFavoritesQuery()
  const [removeProductFromCart, { error, reset }] = commerceApi.useRemoveProductFromCartMutation()

  useEffect(() => setIsFavorite(active), [active])

  const removeFromFavorites = useCallback(
    async (favorite: FavouritesItem) => {
      try {
        setIsFavorite(false)
        await removeProductFromCart({ cartId, entryNumber: favorite?.entryNumber }).unwrap()
      } catch (err: any) {
        setIsFavorite(true)
      }
    },
    [cartId, removeProductFromCart],
  )

  const addToFavourites = useCallback(async () => {
    try {
      setIsFavorite(true)
      // NOTE: no api call is available to execute this action
      throw productCode
    } catch (err) {
      setIsFavorite(false)
    }
  }, [productCode])

  const onToggle = useCallback(async () => {
    /**
     * In order to remove an item from favourites, we need to do so by giving its entryNumber in the api call. That
     * entryNumber in "dynamic" and changes upon every favourite removal, meaning that every consequent request to
     * remove a favourite will fail.
     *
     * For that reason we "index" the favourites with the product.code, and before doing the favourite removal, we
     * refetch the favourites just to make sure that have the item's update entryNumber.
     *
     * Another solution would be to just refresh the favourites after the removal of one, but the refetch is much faster
     * than the actual database deletion, meaning that we have to setTimeout before the refetch, not a clean solution.
     */
    const favorites = await getFavorites(undefined, false)
    const favorite = favorites.data?.favouritesItems.find(
      currentFavorite => currentFavorite.product.code === productCode,
    )

    if (favorite) {
      removeFromFavorites(favorite)
    } else {
      addToFavourites()
    }
  }, [getFavorites, productCode, removeFromFavorites, addToFavourites])

  return (
    <>
      <ErrorAlert error={error} onDismiss={reset} />
      {isFavorite ? (
        <Pressable
          hitSlop={HITSLOP}
          accessibilityRole="button"
          accessibilityLabel={t('favorites_item_remove_a11y_label')}
          testID={testID}
          onPress={onToggle}
          {...pressableProps}>
          <Icon source="HeartSelected" width={36} height={36} />
        </Pressable>
      ) : (
        <Pressable
          hitSlop={HITSLOP}
          accessibilityRole="button"
          accessibilityLabel={t('favorites_item_add_a11y_label')}
          testID={testID}
          onPress={onToggle}
          {...pressableProps}>
          <Icon source="HeartUnselected" width={36} height={36} />
        </Pressable>
      )}
    </>
  )
}
