import React, { useCallback } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux'

import { Button } from '../../../components/button/button'
import { Offer } from '../../../services/api/types/commerce/api-types'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { colors } from '../../../theme/colors'
import { spacing } from '../../../theme/spacing'
import { textStyles } from '../../../theme/typography'
import { useFormattedPrice } from '../../../utils/price/hooks/use-formatted-price'
import { getIsUserLoggedIn } from '../../../services/auth/store/auth-selectors'
import { FavoriteButton } from '../../../components/favorite-button/favorite-button'

type ProductDetailFooterProps = {
  onReserve: () => void
  onFavorite: () => void
  selectedOffer?: Offer
}

export const ProductDetailFooter: React.FC<ProductDetailFooterProps> = ({ onReserve, onFavorite, selectedOffer }) => {
  const { buildTestId } = useTestIdBuilder()
  const { t } = useTranslation()

  const handleFavoritePress = useCallback(() => {
    onFavorite()
  }, [onFavorite])

  const formattedPrice = useFormattedPrice(selectedOffer?.price)
  const isLoggedIn = useSelector(getIsUserLoggedIn)

  return (
    <View style={styles.container} testID={buildTestId('productDetail_footer')}>
      {formattedPrice ? (
        <View style={styles.row}>
          <Text
            testID={buildTestId('productDetail_footer_priceTitle')}
            style={[textStyles.CaptionExtrabold, styles.priceTitle]}>
            {t('productDetail_footer_priceTitle')}
          </Text>
          <Text
            testID={buildTestId('productDetail_footer_price')}
            style={[textStyles.HeadlineH3Extrabold, { color: colors.moonDarkest }]}>
            {formattedPrice}
          </Text>
        </View>
      ) : null}
      {isLoggedIn ? (
        <View style={[styles.row, styles.rowSpacing]}>
          <Button
            widthOption="grow"
            i18nKey="productDetail_footer_reserve_button"
            testID={buildTestId('productDetail_footer_reserve_button')}
            variant="primary"
            onPress={onReserve}
            bodyStyleOverrides={styles.reserveButton}
          />
          <FavoriteButton
            active={false} // TODO: Add favorite functionality
            accessibilityLabel={t('productDetail_footer_favorite_button')}
            testID={buildTestId('productDetail_footer_favorite_button')}
            onPress={handleFavoritePress}
          />
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[5],
    paddingTop: 12,
    borderTopColor: colors.moonDarkest,
    borderTopWidth: 2,
    backgroundColor: colors.basicWhite,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowSpacing: {
    marginTop: spacing[4],
  },
  reserveButton: {
    marginRight: spacing[5],
  },
  priceTitle: {
    height: 26,
    alignSelf: 'center',
    color: colors.moonDarkest,
  },
})
