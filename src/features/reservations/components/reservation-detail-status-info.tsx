import React from 'react'
import { StyleSheet, View } from 'react-native'

import { TranslatedText } from '../../../components/translated-text/translated-text'
import { Order } from '../../../services/api/types/commerce/api-types'
import { colors } from '../../../theme/colors'
import { spacing } from '../../../theme/spacing'
import { dateFormat } from '../../../utils/date/date-format'

export type ReservationDetailStatusInfoProps = {
  order: Order
}

export const ReservationDetailStatusInfo: React.FC<ReservationDetailStatusInfoProps> = ({ order }) => {
  const validUntil = order.entries?.[0].voucherValidTo ? new Date(order.entries[0].voucherValidTo) : undefined
  const orderCode = order.consignments?.find(() => true)?.code
  const reservationDate = order.created ? new Date(order.created) : undefined

  if (!validUntil && !orderCode && !reservationDate) {
    return null
  }

  return (
    <View style={styles.container}>
      {validUntil ? (
        <TranslatedText
          i18nKey="reservationDetail_statusInfo_validUntil_label"
          i18nParams={{ validUntil, formatParams: { validUntil: dateFormat } }}
          textStyle="CaptionSemibold"
          textStyleOverrides={styles.validUntil}
        />
      ) : null}
      {orderCode ? (
        <TranslatedText
          i18nKey="reservationDetail_statusInfo_orderCode_label"
          i18nParams={{ orderCode }}
          textStyle="CaptionSemibold"
          textStyleOverrides={styles.orderCode}
        />
      ) : null}
      {reservationDate ? (
        <TranslatedText
          i18nKey="reservationDetail_statusInfo_reservationDate_label"
          i18nParams={{ reservationDate, formatParams: { reservationDate: dateFormat } }}
          textStyle="CaptionSemibold"
          textStyleOverrides={styles.reservationDate}
        />
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing[2],
    paddingBottom: spacing[5],
    alignItems: 'center',
  },
  validUntil: {
    marginTop: spacing[2],
    color: colors.moonDarkest,
  },
  orderCode: {
    marginTop: spacing[2],
    color: colors.moonBase,
  },
  reservationDate: {
    marginTop: spacing[2],
    color: colors.moonBase,
  },
})
