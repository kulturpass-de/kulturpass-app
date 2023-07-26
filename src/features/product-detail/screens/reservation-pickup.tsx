import React from 'react'
import { StyleSheet, View } from 'react-native'
import { SvgImage } from '../../../components/svg-image/svg-image'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { AvailableTranslations } from '../../../components/translated-text/types'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import { ProductDetail, VoucherProductDetail } from '../types/product-detail'

export type ReservationPickupProps = {
  productDetail: ProductDetail
}

const getPickupTextTranslationKey = (
  fulfillmentOption: VoucherProductDetail['fulfillmentOption'] | null,
): AvailableTranslations | null => {
  switch (fulfillmentOption) {
    case 'PICKUP_CODE':
      return 'productDetail_confirmReservation_voucher_pickupRequired'
    case 'VENDOR_CODE':
      return 'productDetail_confirmReservation_voucher_pickupNotRequired'
    case 'REDEMPTION_CODE':
      return 'productDetail_confirmReservation_product_pickup'
  }
  return null
}

export const ReservationPickup = ({ productDetail }: ReservationPickupProps) => {
  const { buildTestId } = useTestIdBuilder()
  const { colors } = useTheme()

  const pickupCopytext = getPickupTextTranslationKey(productDetail.fulfillmentOption)

  if (pickupCopytext == null) {
    return null
  }

  return (
    <View style={styles.reservationDetailsPickup}>
      <SvgImage type="boings" width={20} height={20} />
      <TranslatedText
        i18nKey={pickupCopytext}
        testID={buildTestId(pickupCopytext)}
        textStyle="BodySmallBold"
        textStyleOverrides={[styles.reservationDetailsPickupText, { color: colors.labelColor }]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  reservationDetailsPickup: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  reservationDetailsPickupText: {
    flex: 1,
    marginBottom: spacing[5],
  },
})
