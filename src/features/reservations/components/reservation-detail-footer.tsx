import React, { useCallback } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux'

import { Button } from '../../../components/button/button'
import { Price, Refunds } from '../../../services/api/types/commerce/api-types'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { colors } from '../../../theme/colors'
import { spacing } from '../../../theme/spacing'
import { textStyles } from '../../../theme/typography'
import { useFormattedPrice } from '../../../utils/price/hooks/use-formatted-price'
import { getIsUserLoggedIn } from '../../../services/auth/store/auth-selectors'
import { FavoriteButton } from '../../../components/favorite-button/favorite-button'
import { TranslatedText } from '../../../components/translated-text/translated-text'

export type ReservationDetailFooterProps = {
  cancellable?: boolean
  onCancelReservation: () => void
  onFavorite: () => void
  price?: Price
  refunds?: Refunds
}

export const ReservationDetailFooter: React.FC<ReservationDetailFooterProps> = ({
  cancellable,
  onCancelReservation,
  onFavorite,
  price,
  refunds,
}) => {
  const { buildTestId } = useTestIdBuilder()
  const { t } = useTranslation()

  const handleFavoritePress = useCallback(() => {
    onFavorite()
  }, [onFavorite])

  const formattedPrice = useFormattedPrice(price)
  const formattedRefundAmount = useFormattedPrice(refunds?.refundAmount)
  const formattedTotalWithoutRefunds = useFormattedPrice(refunds?.totalWithoutRefunds)
  const isLoggedIn = useSelector(getIsUserLoggedIn)
  const hasRefunds = (refunds?.refundAmount?.value ?? 0) > 0

  return (
    <View testID={buildTestId('reservationDetail_footer')} style={styles.container}>
      {formattedPrice ? (
        <View style={styles.rowPrice}>
          {hasRefunds ? (
            <TranslatedText
              testID={buildTestId('reservationDetail_footer_refunds')}
              i18nKey="reservationDetail_footer_refunds"
              i18nParams={{
                totalWithoutRefunds: formattedTotalWithoutRefunds,
                refundAmount: formattedRefundAmount,
              }}
              textStyle="CaptionSemibold"
              textStyleOverrides={styles.priceTitle}
              customComponents={{
                em: <Text style={styles.refundEmph} />,
              }}
            />
          ) : (
            <TranslatedText
              i18nKey="reservationDetail_footer_priceTitle"
              testID={buildTestId('reservationDetail_footer_priceTitle')}
              textStyle="CaptionExtrabold"
              textStyleOverrides={styles.priceTitle}
            />
          )}
          <Text
            testID={buildTestId('reservationDetail_footer_price')}
            style={[textStyles.HeadlineH3Extrabold, styles.price]}>
            {formattedPrice}
          </Text>
        </View>
      ) : null}
      {isLoggedIn ? (
        <View style={styles.rowActions}>
          {cancellable && (
            <Button
              widthOption="grow"
              i18nKey="reservationDetail_footer_cancel_button"
              testID={buildTestId('reservationDetail_footer_cancel_button')}
              variant="secondary"
              onPress={onCancelReservation}
              bodyStyleOverrides={styles.reserveButton}
            />
          )}
          {cancellable && (
            <FavoriteButton
              active={false} // TODO: Add favorite functionality
              accessibilityLabel={t('reservationDetail_footer_favorite_button')}
              testID={buildTestId('reservationDetail_footer_favorite_button')}
              onPress={handleFavoritePress}
            />
          )}
        </View>
      ) : null}
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
  rowPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: spacing[9],
  },
  price: {
    color: colors.moonDarkest,
  },
  rowActions: {
    marginTop: spacing[4],
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reserveButton: {
    marginRight: spacing[5],
  },
  priceTitle: {
    lineHeight: 19,
    color: colors.moonDarkest,
    flexShrink: 1,
    flexWrap: 'wrap',
    marginRight: spacing[5],
  },
  refundEmph: {
    ...textStyles.CaptionSemibold,
    color: colors.basicWhite,
    backgroundColor: colors.primaryDarkest,
  },
})
