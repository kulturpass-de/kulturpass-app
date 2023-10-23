import React, { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import { Badge } from '../../../components/badge/badge'
import { Button } from '../../../components/button/button'
import { ModalScreenFooterPadding } from '../../../components/modal-screen/modal-screen-footer-padding'
import { applyAccessibilityReplacements } from '../../../components/translated-text/accessibility-replacements'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { Offer } from '../../../services/api/types/commerce/api-types'
import { getIsUserLoggedIn } from '../../../services/auth/store/auth-selectors'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { useGetProfile } from '../../../services/user/use-get-profile'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import { textStyles } from '../../../theme/typography'
import { useFormattedPrice } from '../../../utils/price/hooks/use-formatted-price'
import { ProductDetail } from '../types/product-detail'
import { isVoucher } from '../utils'
import { ProductDetailCannotAffordText } from './product-detail-cannot-afford-text'
import { ProductDetailFooterFavoriteButton } from './product-detail-footer-favorite-button'

type ProductDetailFooterProps = {
  onReserve: () => void
  selectedOffer?: Offer
  fulfillmentOption: ProductDetail['fulfillmentOption']
  reservationSuspended: ProductDetail['reservationSuspended']
}

export const ProductDetailFooter: React.FC<ProductDetailFooterProps> = ({
  onReserve,
  selectedOffer,
  fulfillmentOption,
  reservationSuspended = false,
}) => {
  const { buildTestId } = useTestIdBuilder()
  const { colors } = useTheme()
  const { t } = useTranslation()

  const formattedPrice = useFormattedPrice(selectedOffer?.price)
  const isLoggedIn = useSelector(getIsUserLoggedIn)

  const { data } = useGetProfile()

  const canAfford = useMemo(() => {
    const availableBalance = data?.balance?.availableBalance?.value
    const offerPrice = selectedOffer?.price?.value
    const shouldValidateBalance = availableBalance !== undefined && offerPrice !== undefined
    return shouldValidateBalance ? availableBalance >= offerPrice : true
  }, [data, selectedOffer])

  const { showPrice, showReserveButton, showCannotAfford, showNoOffer } = useMemo(() => {
    const isEntitled = data?.balanceStatus === 'ENTITLED'
    const hasSelectedOffer = selectedOffer !== undefined && selectedOffer.code !== undefined
    return {
      showNoOffer: !hasSelectedOffer,
      showPrice: hasSelectedOffer && canAfford && formattedPrice,
      showReserveButton: !reservationSuspended && hasSelectedOffer && isLoggedIn && canAfford && isEntitled,
      showCannotAfford: !reservationSuspended && hasSelectedOffer && isLoggedIn && !canAfford && isEntitled,
    }
  }, [data?.balanceStatus, selectedOffer, canAfford, formattedPrice, reservationSuspended, isLoggedIn])

  const productIsVoucher = useMemo(() => isVoucher(fulfillmentOption), [fulfillmentOption])

  if (!(showPrice || showReserveButton || showCannotAfford || showNoOffer)) {
    return null
  }

  return (
    <View
      style={[styles.container, { backgroundColor: colors.secondaryBackground, borderTopColor: colors.footerBorder }]}
      testID={buildTestId('productDetail_footer')}>
      {showNoOffer ? (
        <View style={styles.noOfferRow}>
          <Badge
            i18nKey="productDetail_footer_noOffer_badge"
            backgroundColorVariant="blue"
            testID={buildTestId('productDetail_footer_noOffer_badge')}
          />
          <TranslatedText
            textStyle="CaptionSemibold"
            i18nKey="productDetail_footer_noOffer_text"
            testID={buildTestId('productDetail_footer_noOffer_text')}
            textStyleOverrides={{ color: colors.labelColor }}
          />
        </View>
      ) : null}
      {showPrice && formattedPrice ? (
        <View style={styles.row}>
          {productIsVoucher ? (
            <View style={styles.badge}>
              <Badge i18nKey="voucher_badge" testID={buildTestId('productDetail_footer_voucher_badge')} />
            </View>
          ) : null}
          <View
            testID={buildTestId('productDetail_footer_priceTitleAndPrice')}
            style={styles.priceRow}
            accessible
            accessibilityLabel={
              t(productIsVoucher ? 'productDetail_footer_voucher_priceTitle' : 'productDetail_footer_priceTitle') +
              applyAccessibilityReplacements(formattedPrice)
            }>
            <Text
              testID={buildTestId('productDetail_footer_priceTitle')}
              style={[textStyles.CaptionExtrabold, { color: colors.labelColor }]}
              accessibilityElementsHidden>
              {t(productIsVoucher ? 'productDetail_footer_voucher_priceTitle' : 'productDetail_footer_priceTitle')}
            </Text>
            <View style={styles.spacer} />
            <Text
              testID={buildTestId('productDetail_footer_price')}
              style={[textStyles.HeadlineH3Extrabold, styles.fixLineHeight, { color: colors.labelColor }]}
              accessibilityElementsHidden>
              {formattedPrice}
            </Text>
          </View>
          {!showReserveButton && selectedOffer?.code && isLoggedIn && (
            <View style={styles.favoriteButtonNotEntitled}>
              <ProductDetailFooterFavoriteButton productCode={selectedOffer?.productCode} size={48} />
            </View>
          )}
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
          {selectedOffer?.code && (
            <ProductDetailFooterFavoriteButton productCode={selectedOffer?.productCode} size={48} />
          )}
        </View>
      ) : null}
      {showCannotAfford ? (
        <View style={styles.row}>
          <ProductDetailCannotAffordText
            availableBalance={data?.balance.availableBalance}
            productIsVoucher={productIsVoucher}
          />
          <Text
            testID={buildTestId('productDetail_footer_price')}
            style={[textStyles.HeadlineH3Extrabold, { color: colors.labelColor }]}>
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
    borderTopWidth: 2,
  },
  badge: {
    alignContent: 'center',
    paddingRight: spacing[2],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    flexGrow: 1,
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
  spacer: {
    flexGrow: 1,
    flex: 1,
  },
  fixLineHeight: {
    // fontSize is 25 and lineHeight 29,
    // to make it vertically centered:
    marginTop: 4,
  },
  favoriteButtonNotEntitled: {
    marginLeft: spacing[5],
  },
  noOfferRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing[2],
    paddingBottom: spacing[4],
    gap: spacing[2],
  },
})
