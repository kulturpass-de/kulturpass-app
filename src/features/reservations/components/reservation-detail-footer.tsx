import React, { useCallback } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import { Button } from '../../../components/button/button'
import { ModalScreenFooterPadding } from '../../../components/modal-screen/modal-screen-footer-padding'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { Price, Refunds } from '../../../services/api/types/commerce/api-types'
import { getIsUserLoggedIn } from '../../../services/auth/store/auth-selectors'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { colors } from '../../../theme/colors'
import { spacing } from '../../../theme/spacing'
import { textStyles } from '../../../theme/typography'
import { useFormattedPrice } from '../../../utils/price/hooks/use-formatted-price'

export type ReservationDetailFooterProps = {
  cancellable?: boolean
  onCancelReservation: () => void
  price?: Price
  refunds?: Refunds
  completedReservation?: boolean
  orderStatus?: string
  isCancelTriggered?: boolean
}

export const ReservationDetailFooter: React.FC<ReservationDetailFooterProps> = ({
  cancellable,
  onCancelReservation,
  price,
  refunds,
  completedReservation,
  orderStatus,
  isCancelTriggered,
}) => {
  const { buildTestId } = useTestIdBuilder()

  const formattedPrice = useFormattedPrice(price)
  const formattedRefundAmount = useFormattedPrice(refunds?.refundAmount)
  const formattedTotalWithoutRefunds = useFormattedPrice(refunds?.totalWithoutRefunds)
  const isLoggedIn = useSelector(getIsUserLoggedIn)
  const hasRefunds = (refunds?.refundAmount?.value ?? 0) > 0

  const noop = useCallback(() => {}, [])

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
      {isLoggedIn && !completedReservation ? (
        <View style={styles.rowActions}>
          {cancellable && (
            <Button
              widthOption="grow"
              i18nKey="reservationDetail_footer_cancel_button"
              testID={buildTestId('reservationDetail_footer_cancel_button')}
              variant="secondary"
              onPress={onCancelReservation}
              disabled={isCancelTriggered}
            />
          )}
          {orderStatus === 'CREATED' && !cancellable && (
            <Button
              widthOption="grow"
              i18nKey="reservationDetail_footer_cancel_button_creating"
              testID={buildTestId('reservationDetail_footer_cancel_button_creating')}
              variant="secondary"
              onPress={noop}
              disabled={true}
            />
          )}
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
  rowPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: spacing[9],
    gap: spacing[5],
  },
  price: {
    color: colors.moonDarkest,
  },
  rowActions: {
    marginTop: spacing[4],
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceTitle: {
    lineHeight: 19,
    color: colors.moonDarkest,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  refundEmph: {
    ...textStyles.CaptionSemibold,
    color: colors.basicWhite,
    backgroundColor: colors.primaryDarkest,
  },
})
