import React, { useCallback } from 'react'
import { Image, Pressable, PressableProps, StyleSheet, Text, View } from 'react-native'
import { FavoriteButton } from '../../components/favorite-button/favorite-button'
import { ErrorAlert } from '../../features/form-validation/components/error-alert'
import { FavouritesItem, Product } from '../../services/api/types/commerce/api-types'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { colors } from '../../theme/colors'
import { HITSLOP_FAVORITES_LIST_ITEM } from '../../theme/constants'
import { spacing } from '../../theme/spacing'
import { textStyles } from '../../theme/typography'
import { useFormattedDateTime } from '../../utils/date/hooks/use-formatted-date-time'
import { useProductImageUrl } from '../../utils/image/hooks/use-product-image-url'
import { useFormattedPrice } from '../../utils/price/hooks/use-formatted-price'
import { useFavouritesListItemActions } from './use-favourites-list-item-actions'

export type FavoritesListItemProps = {
  favourite: FavouritesItem
  onPress?: (product: Product) => void
}

export const ITEM_HEIGHT = 164

export const FavoritesListItem: React.FC<FavoritesListItemProps> = ({ favourite: { product }, onPress }) => {
  const { buildTestId } = useTestIdBuilder()
  const { t } = useTranslation()

  const {
    name: title = '',
    images,
    topCategoryName,
    shopDistance,
    offerCount: productOfferCount,
    eventStartDate,
    lowestOfferPrice,
    seller,
  } = product
  const { imageUrl, image } = useProductImageUrl(images, 'product')
  const offersCount = productOfferCount ?? 0
  const shopName = offersCount > 1 ? t('favorites_item_multiple_offers') : seller
  const formattedPrice = useFormattedPrice(lowestOfferPrice)
  const formattedPriceInformation =
    offersCount > 1 ? t('favorites_item_multiple_offers_price', { price: formattedPrice }) : formattedPrice
  const formattedEventStartDate = useFormattedDateTime(eventStartDate)

  const { isFavorite, addToFavourites, removeFromFavorites, toggleIsFavourite, error, resetError } =
    useFavouritesListItemActions(product.code)

  const shopInformation = React.useMemo(() => {
    if (shopName !== undefined) {
      if (shopDistance !== undefined) {
        return `${t('favorites_item_distance', { distance: shopDistance })} | ${shopName}`
      } else {
        return shopName
      }
    }
  }, [shopName, shopDistance, t])

  const handlePressFavourite = useCallback(() => {
    onPress?.(product)
  }, [onPress, product])

  const onAccessibilityAction: NonNullable<PressableProps['onAccessibilityAction']> = useCallback(
    event => {
      switch (event.nativeEvent.actionName) {
        case 'view-product-details':
          handlePressFavourite()
          break
        case 'add-product-to-favourites':
          addToFavourites()
          break
        case 'remove-product-from-favourites':
          removeFromFavorites()
          break
      }
    },
    [handlePressFavourite, addToFavourites, removeFromFavorites],
  )

  const accessibilityActions = isFavorite
    ? [
        { name: 'view-product-details', label: t('favorites_item_view_details_a11y_label') },
        { name: 'remove-product-from-favourites', label: t('favorites_item_remove_a11y_label') },
      ]
    : [
        { name: 'view-product-details', label: t('favorites_item_view_details_a11y_label') },
        // NOTE: Currently, when the item is removed from favourites - the user can not re-add it to favourites.
        // Later when the api is available to re-add the item to favourites - uncomment the next line.
        // { name: 'add-product-to-favourites', label: t('favorites_item_add_a11y_label') },
      ]

  return (
    <>
      <ErrorAlert error={error} onDismiss={resetError} />
      <Pressable
        onPress={handlePressFavourite}
        accessibilityRole="button"
        accessibilityActions={accessibilityActions}
        onAccessibilityAction={onAccessibilityAction}>
        <View
          testID={buildTestId('screens_favorites_favorites_list_item')}
          style={[styles.container, { height: ITEM_HEIGHT }]}>
          <View style={styles.containerItem}>
            <View style={styles.imageContainer}>
              {imageUrl && (
                <>
                  <Image
                    testID={buildTestId('screens_favorites_favorites_list_item_image')}
                    style={styles.image}
                    source={{ uri: imageUrl }}
                  />
                  {topCategoryName !== undefined ? (
                    <Text
                      testID={buildTestId('screens_favorites_favorites_list_item_top_category_name')}
                      numberOfLines={2}
                      style={styles.categoryName}>
                      {topCategoryName}
                    </Text>
                  ) : null}
                </>
              )}
              {image?.altText && (
                <View testID={buildTestId('screens_favorites_favorites_list_item_badge')} style={styles.imageBadge}>
                  <Text
                    numberOfLines={2}
                    style={textStyles.MicroExtraboldCaps}
                    testID={buildTestId('screens_favorites_favorites_list_item_image_alt')}>
                    {image.altText}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.main}>
              <View style={styles.content}>
                <Text
                  testID={buildTestId('screens_favorites_favorites_list_item_title')}
                  style={[textStyles.BodyExtrabold, styles.title]}
                  numberOfLines={2}>
                  {title}
                </Text>
                <View style={styles.informationLine}>
                  {shopInformation !== undefined ? (
                    <Text
                      numberOfLines={1}
                      testID={buildTestId('favorites_item_shopInformation')}
                      style={styles.informationToken}>
                      {shopInformation}
                    </Text>
                  ) : (
                    <Text
                      numberOfLines={1}
                      testID={buildTestId('favorites_item_no_offers')}
                      style={styles.informationToken}>
                      {t('favorites_item_no_offers')}
                    </Text>
                  )}
                </View>
                <View style={styles.informationLine}>
                  {formattedEventStartDate ? (
                    <Text
                      numberOfLines={1}
                      testID={buildTestId('favorites_item_event_start_date')}
                      style={styles.informationToken}>
                      {t('favorites_item_event_start_date', {
                        date: formattedEventStartDate.date,
                        time: formattedEventStartDate.time,
                      })}
                    </Text>
                  ) : null}
                </View>
                {formattedPriceInformation ? (
                  <Text
                    numberOfLines={1}
                    testID={buildTestId('screens_favorites_favorites_list_item_price')}
                    style={styles.price}>
                    {formattedPriceInformation}
                  </Text>
                ) : null}
              </View>
              <View style={styles.actionContainer}>
                <FavoriteButton
                  testID={buildTestId('screens_favorites_favorites_list_item_heart_button')}
                  isFavorite={isFavorite}
                  hitSlop={HITSLOP_FAVORITES_LIST_ITEM}
                  onPress={toggleIsFavourite}
                />
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  containerItem: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'stretch',
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[5],
  },
  imageContainer: {
    borderRadius: 16,
    backgroundColor: colors.sunDark,
    height: '100%',
    aspectRatio: 1,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
  },
  categoryName: {
    ...textStyles.MicroExtraboldCaps,
    paddingVertical: spacing[0],
    paddingHorizontal: spacing[2] - 2,
    position: 'absolute',
    bottom: spacing[6] - 4,
    color: colors.moonDarkest,
    backgroundColor: colors.basicWhite,
  },
  main: {
    marginLeft: spacing[4],
    flex: 1,
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'column',
    flex: 1,
  },
  title: {
    marginBottom: spacing[1],
    color: colors.moonDarkest,
  },
  informationLine: {
    paddingTop: spacing[1],
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  informationToken: {
    ...textStyles.BodySmallRegular,
    color: colors.moonDarkest,
  },
  price: {
    ...textStyles.HeadlineH4Extrabold,
    marginTop: spacing[2],
    color: colors.moonDarkest,
  },
  actionContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  imageBadge: {
    position: 'absolute',
    bottom: '10%',
    left: 0,
    backgroundColor: colors.basicWhite,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[0],
  },
})
