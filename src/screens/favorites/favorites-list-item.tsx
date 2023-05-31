import * as React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { textStyles } from '../../theme/typography'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { FavouritesItem } from '../../services/api/types/commerce/api-types'
import { useFormattedPrice } from '../../utils/price/hooks/use-formatted-price'
import { FavoriteButton } from '../../components/favorite-button/favorite-button'
import { useTranslation } from '../../services/translation/translation'
import { useProductImageUrl } from '../../utils/image/hooks/use-product-image-url'
import { useFormattedDateTime } from '../../utils/date/hooks/use-formatted-date-time'
import { HITSLOP_FAVORITES_LIST_ITEM } from '../../theme/constants'

export type FavoritesListItemProps = {
  favourite: FavouritesItem
}

export const ITEM_HEIGHT = 164

export const FavoritesListItem: React.FC<FavoritesListItemProps> = ({ favourite: { cartId, product } }) => {
  const { buildTestId } = useTestIdBuilder()
  const { t } = useTranslation()

  const { name: title = '', images, topCategoryName, shopDistance, offersSummary, eventStartDate } = product
  const { imageUrl, image } = useProductImageUrl(images, 'product')
  const offersCount = offersSummary?.offerCount ?? 0
  const shopName = offersCount > 1 ? t('favorites_item_multiple_offers') : offersSummary?.bestOffer?.shopName
  const formattedPrice = useFormattedPrice(offersSummary?.bestOffer?.price)
  const formattedPriceInformation =
    offersCount > 1 ? t('favorites_item_multiple_offers_price', { price: formattedPrice }) : formattedPrice
  const formattedEventStartDate = useFormattedDateTime(eventStartDate)

  const shopInformation = React.useMemo(() => {
    if (shopName !== undefined) {
      if (shopDistance !== undefined) {
        return `${t('favorites_item_distance', { distance: shopDistance })} | ${shopName}`
      } else {
        return shopName
      }
    }
  }, [shopName, shopDistance, t])
  return (
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
              cartId={cartId}
              productCode={product.code}
              active={true}
              hitSlop={HITSLOP_FAVORITES_LIST_ITEM}
            />
          </View>
        </View>
      </View>
    </View>
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
    aspectRatio: 9 / 12,
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
