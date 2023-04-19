import * as React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Icon } from '../../components/icon/icon'
import { typography } from '../../theme/typography'
import { useTranslation } from '../../services/translation/translation'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { Price } from '../../services/api/types/commerce/api-types'
import { useFormattedPrice } from '../../utils/price/hooks/use-formatted-price'

export type FavoritesListItemProps = {
  imageUrl?: string
  imageAlt?: string
  title: string
  price?: Price
  onPressAddFavorite: () => void
}

export const ITEM_HEIGHT = 164

export const FavoritesListItem: React.FC<FavoritesListItemProps> = ({
  imageUrl,
  imageAlt,
  title,
  price,
  onPressAddFavorite,
}) => {
  const { t } = useTranslation()
  const { buildTestId } = useTestIdBuilder()
  const formattedPrice = useFormattedPrice(price)

  return (
    <View
      testID={buildTestId('screens_favorites_favorites_list_item')}
      style={[styles.container, { height: ITEM_HEIGHT }]}>
      <View style={styles.containerItem}>
        <View style={styles.imageContainer}>
          {imageUrl && (
            <Image
              testID={buildTestId('screens_favorites_favorites_list_item_image')}
              style={styles.image}
              source={{ uri: imageUrl }}
            />
          )}
          {imageAlt && (
            <View testID={buildTestId('screens_favorites_favorites_list_item_badge')} style={styles.imageBadge}>
              <Text
                numberOfLines={2}
                style={styles.imageBadgeText}
                testID={buildTestId('screens_favorites_favorites_list_item_image_alt')}>
                {imageAlt}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.main}>
          <View style={styles.content}>
            <Text testID={buildTestId('screens_favorites_favorites_list_item_title')} style={styles.title}>
              {title}
            </Text>
            {formattedPrice ? (
              <Text testID={buildTestId('screens_favorites_favorites_list_item_price')} style={styles.price}>
                {formattedPrice}
              </Text>
            ) : null}
          </View>
          <View style={styles.actionContainer}>
            <TouchableOpacity
              testID={buildTestId('screens_favorites_favorites_list_item_heart_button')}
              accessibilityLabel={t('favorites_item_remove_a11y_label')}
              hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
              onPress={onPressAddFavorite}>
              <Icon source="HeartUnselected" width={24} height={24} />
            </TouchableOpacity>
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
    backgroundColor: colors.basicWhite,
  },
  imageContainer: {
    borderRadius: 5,
    backgroundColor: colors.sunDark,
    height: '100%',
    aspectRatio: 9 / 12,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
  },
  main: {
    paddingLeft: 12,
    flex: 1,
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'column',
    flex: 1,
  },
  title: {
    fontFamily: typography.primary,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 22,
    color: colors.moonDarkest,
    marginBottom: 6,
  },
  price: {
    fontFamily: typography.primary,
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 24,
  },
  actionContainer: {
    justifyContent: 'center',
  },
  imageBadge: {
    position: 'absolute',
    bottom: '10%',
    left: 0,
    backgroundColor: colors.basicWhite,
    paddingHorizontal: 6,
  },
  imageBadgeText: {
    fontFamily: typography.primary,
    fontSize: 10,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
})
