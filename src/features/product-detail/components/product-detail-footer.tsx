import React, { useCallback, useMemo } from 'react'
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
import { commerceApi } from '../../../services/api/commerce-api'
import { TranslatedText } from '../../../components/translated-text/translated-text'

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

  const { data } = commerceApi.useGetProfileQuery({}, { skip: !isLoggedIn })

  const availableBalanceFormatted = useFormattedPrice(data?.balance?.availableBalance)

  const canAfford = useMemo(() => {
    const availableBalance = data?.balance?.availableBalance?.value
    const offerPrice = selectedOffer?.price?.value
    const shouldValidateBalance = availableBalance !== undefined && offerPrice !== undefined
    return shouldValidateBalance ? availableBalance >= offerPrice : true
  }, [data, selectedOffer])

  return (
    <View style={styles.container} testID={buildTestId('productDetail_footer')}>
      {canAfford && formattedPrice ? (
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
      {isLoggedIn && canAfford ? (
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
      {isLoggedIn && !canAfford ? (
        <View style={[styles.row, styles.rowCentered]}>
          <View style={styles.cannotAffordContainer}>
            <TranslatedText
              textStyle="CaptionSemibold"
              textStyleOverrides={styles.discount}
              testID={buildTestId('productDetail_footer_cannot_afford_text')}
              i18nKey="productDetail_footer_cannot_afford"
              i18nParams={{ availableBalance: availableBalanceFormatted }}
              customComponents={{
                mark: <Text style={[styles.cannotAffordMarkedBalance, styles.discountAvailableBalance]} />,
              }}
            />
          </View>
          <Text
            testID={buildTestId('productDetail_footer_price')}
            style={[textStyles.HeadlineH3Extrabold, { color: colors.moonDarkest }]}>
            {formattedPrice}
          </Text>
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
  rowCentered: {
    alignItems: 'center',
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
  cannotAffordContainer: {
    flex: 1,
    paddingRight: spacing[6],
  },
  cannotAffordMarkedBalance: {
    color: colors.basicWhite,
    backgroundColor: colors.primaryDarkest,
  },
  discount: {
    lineHeight: 19,
  },
  discountAvailableBalance: {
    lineHeight: 19,
    fontWeight: '700',
  },
})
