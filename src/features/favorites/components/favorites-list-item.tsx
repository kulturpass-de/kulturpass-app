import React, { useCallback } from 'react'
import { Pressable, PressableProps, StyleSheet, Text, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { Badge } from '../../../components/badge/badge'
import { FavoriteButton } from '../../../components/favorite-button/favorite-button'
import { Product } from '../../../services/api/types/commerce/api-types'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { HITSLOP_FAVORITES_LIST_ITEM } from '../../../theme/constants'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import { textStyles } from '../../../theme/typography'
import { useProductImageUrl } from '../../../utils/image/hooks/use-product-image-url'
import { useFormattedPrice } from '../../../utils/price/hooks/use-formatted-price'
import { ErrorAlert } from '../../form-validation/components/error-alert'
import { isVoucher } from '../../product-detail/utils'
import { useFavouritesListItemActions } from '../hooks/use-favourites-list-item-actions'
import { FavoritesEventDate } from './favorites-event-date'
import { FavoritesListItemImageBadge } from './favorites-list-item-image-badge'
import { InformationLine } from './information-line'

export type FavoritesListItemProps = {
  product: Product
  onPress?: (product: Product) => void
}

export const ITEM_HEIGHT = 164

export const FavoritesListItem: React.FC<FavoritesListItemProps> = ({ product, onPress }) => {
  const { buildTestId } = useTestIdBuilder()
  const { colors } = useTheme()
  const { t } = useTranslation()

  const {
    name: title = '',
    images,
    topCategoryName,
    shopDistance,
    offerCount: productOfferCount,
    eventStartDate,
    eventEndDate,
    lowestOfferPrice,
    seller,
    fulfillmentOption,
    venueName,
    itemType,
  } = product
  const { imageUrl } = useProductImageUrl(images, 'product')
  const offersCount = productOfferCount ?? 0
  let shopName: string | undefined
  if (offersCount > 1) {
    shopName = t('favorites_item_multiple_offers')
  } else if (product.offersSummary?.bestOffer?.shopName) {
    shopName = product.offersSummary?.bestOffer?.shopName
  } else {
    shopName = seller
  }
  const formattedPrice = useFormattedPrice(lowestOfferPrice)
  const formattedPriceInformation =
    offersCount > 1 ? t('favorites_item_multiple_offers_price', { price: formattedPrice }) : formattedPrice

  const { isFavorite, addToFavourites, removeFromFavorites, toggleIsFavourite, error, resetError } =
    useFavouritesListItemActions(product.code)

  const handlePressProduct = useCallback(() => {
    onPress?.(product)
  }, [onPress, product])

  const onAccessibilityAction: NonNullable<PressableProps['onAccessibilityAction']> = useCallback(
    event => {
      switch (event.nativeEvent.actionName) {
        case 'view-product-details':
          handlePressProduct()
          break
        case 'add-product-to-favourites':
          addToFavourites()
          break
        case 'remove-product-from-favourites':
          removeFromFavorites()
          break
      }
    },
    [handlePressProduct, addToFavourites, removeFromFavorites],
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
        onPress={handlePressProduct}
        accessibilityRole="button"
        accessibilityActions={accessibilityActions}
        onAccessibilityAction={onAccessibilityAction}>
        <View
          testID={buildTestId('screens_favorites_favorites_list_item')}
          style={[styles.container, { minHeight: ITEM_HEIGHT }]}>
          <View style={styles.containerItem}>
            <View style={styles.imageContainer}>
              {imageUrl && (
                <>
                  <FastImage
                    testID={buildTestId('screens_favorites_favorites_list_item_image')}
                    accessibilityLabel={t('favorites_item_image')}
                    style={[styles.image, { backgroundColor: colors.secondaryBackground }]}
                    resizeMode={FastImage.resizeMode.cover}
                    source={{ uri: imageUrl }}
                  />
                  {topCategoryName !== undefined ? (
                    <FavoritesListItemImageBadge
                      testID={buildTestId('screens_favorites_favorites_list_item_top_category_name')}>
                      {topCategoryName}
                    </FavoritesListItemImageBadge>
                  ) : null}
                </>
              )}
            </View>
            <View style={styles.main}>
              <View style={styles.content}>
                <Text
                  testID={buildTestId('screens_favorites_favorites_list_item_title')}
                  style={[textStyles.BodyExtrabold, { color: colors.labelColor }]}>
                  {title}
                </Text>
                <View style={styles.informationLine}>
                  <InformationLine
                    shopDistance={shopDistance}
                    shopName={shopName}
                    venueName={venueName}
                    itemType={itemType}
                  />
                </View>
                <View style={styles.informationLine}>
                  <FavoritesEventDate startDate={eventStartDate} endDate={eventEndDate} />
                </View>
                {isVoucher(fulfillmentOption) ? (
                  <Badge i18nKey="voucher_badge" testID={buildTestId('favorites_item_voucher_badge')} />
                ) : null}
                {formattedPriceInformation ? (
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="head"
                    testID={buildTestId('screens_favorites_favorites_list_item_price')}
                    style={[styles.price, { color: colors.labelColor }]}>
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
                  size={36}
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
    justifyContent: 'center',
  },
  containerItem: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'stretch',
    paddingVertical: spacing[5],
  },
  imageContainer: {
    borderRadius: 16,
    width: '33%',
    minWidth: 96,
    maxWidth: 128,
    aspectRatio: 1,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
  },
  main: {
    marginLeft: spacing[4],
    flex: 1,
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'column',
    flex: 1,
    rowGap: spacing[1],
  },
  informationLine: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  price: {
    ...textStyles.HeadlineH4Extrabold,
    paddingTop: spacing[0],
    marginRight: spacing[7],
  },
  actionContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
})
