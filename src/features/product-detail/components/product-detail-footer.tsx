import React, { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import { Button } from '../../../components/button/button'
import { ModalScreenFooterPadding } from '../../../components/modal-screen/modal-screen-footer-padding'
import { applyAccessibilityReplacements } from '../../../components/translated-text/accessibility-replacements'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { commerceApi } from '../../../services/api/commerce-api'
import { Offer } from '../../../services/api/types/commerce/api-types'
import { getIsUserLoggedIn } from '../../../services/auth/store/auth-selectors'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { colors } from '../../../theme/colors'
import { spacing } from '../../../theme/spacing'
import { textStyles } from '../../../theme/typography'
import { useFormattedPrice } from '../../../utils/price/hooks/use-formatted-price'
import { ProductDetailFooterFavoriteButton } from './product-detail-footer-favorite-button'

type ProductDetailFooterProps = {
  onReserve: () => void
  selectedOffer?: Offer
}

export const ProductDetailFooter: React.FC<ProductDetailFooterProps> = ({ onReserve, selectedOffer }) => {
  const { buildTestId } = useTestIdBuilder()
  const { t } = useTranslation()

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

  const { showPrice, showReserveButton, showCannotAfford } = useMemo(() => {
    const isEntitled = data?.balanceStatus === 'ENTITLED'
    const hasSelectedOffer = selectedOffer !== undefined && selectedOffer.code !== undefined
    return {
      showPrice: canAfford && formattedPrice,
      showReserveButton: hasSelectedOffer && isLoggedIn && canAfford && isEntitled,
      showCannotAfford: hasSelectedOffer && isLoggedIn && !canAfford && isEntitled,
    }
  }, [data?.balanceStatus, selectedOffer, canAfford, formattedPrice, isLoggedIn])

  if (!(showPrice || showReserveButton || showCannotAfford)) {
    return null
  }

  return (
    <View style={styles.container} testID={buildTestId('productDetail_footer')}>
      {showPrice && formattedPrice ? (
        <View
          style={styles.row}
          accessible
          accessibilityLabel={t('productDetail_footer_priceTitle') + applyAccessibilityReplacements(formattedPrice)}>
          <Text
            testID={buildTestId('productDetail_footer_priceTitle')}
            style={[textStyles.CaptionExtrabold, styles.priceTitle]}
            accessibilityElementsHidden>
            {t('productDetail_footer_priceTitle')}
          </Text>
          <Text
            testID={buildTestId('productDetail_footer_price')}
            style={[textStyles.HeadlineH3Extrabold, { color: colors.moonDarkest }]}
            accessibilityElementsHidden>
            {formattedPrice}
          </Text>
        </View>
      ) : null}
      {showReserveButton ? (
        <View style={styles.rowReserve}>
          <View style={styles.reserButtonContainer}>
            <Button
              widthOption="grow"
              i18nKey="productDetail_footer_reserve_button"
              testID={buildTestId('productDetail_footer_reserve_button')}
              variant="primary"
              onPress={onReserve}
            />
          </View>
          {selectedOffer?.code && <ProductDetailFooterFavoriteButton productCode={selectedOffer?.productCode} />}
        </View>
      ) : null}
      {showCannotAfford ? (
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
      <ModalScreenFooterPadding fallbackPadding={spacing[4]} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
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
  rowReserve: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing[4],
    gap: spacing[4],
  },
  reserButtonContainer: {
    flexGrow: 1,
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
