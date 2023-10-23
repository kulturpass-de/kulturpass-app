import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { Refunds } from '../../../services/api/types/commerce/api-types'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTheme } from '../../../theme/hooks/use-theme'
import { useFormattedPrice } from '../../../utils/price/hooks/use-formatted-price'

export type ReservationDetailRefundsTextProps = {
  productIsVoucher: boolean
  refunds?: Refunds
}

export const ReservationDetailRefundsText: React.FC<ReservationDetailRefundsTextProps> = ({
  productIsVoucher,
  refunds,
}) => {
  const { buildTestId } = useTestIdBuilder()
  const { colors } = useTheme()

  const formattedRefundAmount = useFormattedPrice(refunds?.refundAmount)
  const formattedTotalWithoutRefunds = useFormattedPrice(refunds?.totalWithoutRefunds)

  return (
    <TranslatedText
      testID={buildTestId('reservationDetail_footer_refunds')}
      i18nKey={productIsVoucher ? 'reservationDetail_footer_voucher_refunds' : 'reservationDetail_footer_refunds'}
      i18nParams={{
        totalWithoutRefunds: formattedTotalWithoutRefunds,
        refundAmount: formattedRefundAmount,
      }}
      textStyle="CaptionSemibold"
      textStyleOverrides={[styles.refunds, { color: colors.labelColor }]}
      customComponents={{
        em: (
          <Text
            style={[
              productIsVoucher
                ? {
                    color: colors.emphasizedPriceVoucherColor,
                    backgroundColor: colors.emphasizedPriceVoucherBackground,
                  }
                : { color: colors.emphasizedPriceColor, backgroundColor: colors.emphasizedPriceBackground },
              styles.refundBalance,
            ]}
          />
        ),
      }}
    />
  )
}

const styles = StyleSheet.create({
  refunds: {
    flex: 1,
    lineHeight: 19,
  },
  refundBalance: {
    lineHeight: 19,
    fontWeight: '700',
  },
})
