import React, { useCallback, useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import { Badge } from '../../../components/badge/badge'
import { Button } from '../../../components/button/button'
import { ModalScreenFooterPadding } from '../../../components/modal-screen/modal-screen-footer-padding'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { Price, Refunds } from '../../../services/api/types/commerce/api-types'
import { getIsUserLoggedIn } from '../../../services/auth/store/auth-selectors'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTextStyles } from '../../../theme/hooks/use-text-styles'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import { useFormattedPrice } from '../../../utils/price/hooks/use-formatted-price'
import { ProductDetail } from '../../product-detail/types/product-detail'
import { isVoucher } from '../../product-detail/utils'
import { ReservationDetailRefundsText } from './reservation-detail-refunds-text'

export type ReservationDetailFooterProps = {
  cancellable?: boolean
  onCancelReservation: () => void
  price?: Price
  refunds?: Refunds
  completedReservation?: boolean
  orderStatus?: string
  isCancelTriggered?: boolean
  fulfillmentOption: ProductDetail['fulfillmentOption']
}

export const ReservationDetailFooter: React.FC<ReservationDetailFooterProps> = ({
  cancellable,
  onCancelReservation,
  price,
  refunds,
  completedReservation,
  orderStatus,
  isCancelTriggered,
  fulfillmentOption,
}) => {
  const { buildTestId } = useTestIdBuilder()
  const { colors } = useTheme()
  const [textStyles] = useTextStyles()

  const formattedPrice = useFormattedPrice(price)

  const isLoggedIn = useSelector(getIsUserLoggedIn)
  const hasRefunds = (refunds?.refundAmount?.value ?? 0) > 0

  const noop = useCallback(() => {}, [])

  const productIsVoucher = useMemo(() => isVoucher(fulfillmentOption), [fulfillmentOption])

  return (
    <View
      testID={buildTestId('reservationDetail_footer')}
      style={[styles.container, { backgroundColor: colors.secondaryBackground, borderTopColor: colors.footerBorder }]}>
      {formattedPrice ? (
        <View style={styles.rowPrice}>
          {hasRefunds ? (
            <ReservationDetailRefundsText refunds={refunds} productIsVoucher={productIsVoucher} />
          ) : (
            <View style={styles.leftRow}>
              {productIsVoucher ? (
                <View style={styles.badge}>
                  <Badge i18nKey="voucher_badge" testID={buildTestId('reservationDetail_footer_voucher_badge')} />
                </View>
              ) : null}
              <TranslatedText
                i18nKey={
                  productIsVoucher
                    ? 'reservationDetail_footer_voucher_priceTitle'
                    : 'reservationDetail_footer_priceTitle'
                }
                testID={buildTestId('reservationDetail_footer_priceTitle')}
                textStyle="CaptionExtrabold"
                textStyleOverrides={[styles.priceTitle, { color: colors.labelColor }]}
              />
            </View>
          )}
          <Text
            testID={buildTestId('reservationDetail_footer_price')}
            style={[textStyles.HeadlineH3Extrabold, { color: colors.labelColor }]}>
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
    borderTopWidth: 2,
  },
  badge: {
    alignContent: 'center',
    paddingRight: spacing[2],
  },
  rowPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: spacing[9],
    gap: spacing[5],
  },
  rowActions: {
    marginTop: spacing[4],
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    flex: 1,
  },
  priceTitle: {
    flex: 1,
  },
})
