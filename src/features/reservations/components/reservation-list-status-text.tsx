import React, { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Icon, IconProps } from '../../../components/icon/icon'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { colors } from '../../../theme/colors'
import { spacing } from '../../../theme/spacing'
import { textStyles } from '../../../theme/typography'
import {
  DELIVERY_SCENARIO_IN_APP_VOUCHER,
  DELIVERY_SCENARIO_PICKUP,
  ORDER_STATUS_CANCELLED,
  ORDER_STATUS_COMPLETED,
  ORDER_STATUS_CREATED,
  ORDER_STATUS_READY_FOR_PICKUP,
  ORDER_STATUS_RECEIVED,
  ORDER_STATUS_SHIPPING,
} from '../../../services/api/types/commerce/commerce-reservations'

export type ReservationListStatusTextProps = {
  status: string
  deliveryScenario?: string
}

export const ReservationListStatusText: React.FC<ReservationListStatusTextProps> = ({ status, deliveryScenario }) => {
  const { t } = useTranslation()
  const { buildTestId } = useTestIdBuilder()

  const { icon, color }: { icon: IconProps['source']; color: keyof typeof colors } = useMemo(() => {
    switch (status) {
      case ORDER_STATUS_READY_FOR_PICKUP:
        return { icon: 'Ready', color: 'greenDarkest' }
      case ORDER_STATUS_RECEIVED:
      case ORDER_STATUS_COMPLETED:
        return { icon: 'Completed', color: 'moonDarkest' }
      case ORDER_STATUS_CANCELLED:
        return { icon: 'Cancelled', color: 'redDarkest' }
      default:
        return { icon: 'Processing', color: 'primaryDarkest' }
    }
  }, [status])

  const colorStyle = { color: colors[color] }

  const i18nKey = useMemo(() => {
    if (status === ORDER_STATUS_CREATED || status === ORDER_STATUS_SHIPPING || status === ORDER_STATUS_CANCELLED) {
      return `reservations_list_state_${status.toLowerCase()}`
    } else if (
      (deliveryScenario === DELIVERY_SCENARIO_PICKUP || deliveryScenario === DELIVERY_SCENARIO_IN_APP_VOUCHER) &&
      (status === ORDER_STATUS_READY_FOR_PICKUP ||
        status === ORDER_STATUS_RECEIVED ||
        status === ORDER_STATUS_COMPLETED)
    ) {
      return `reservations_list_state_${status.toLowerCase()}_${deliveryScenario.toLowerCase()}`
    } else {
      return status
    }
  }, [status, deliveryScenario])

  return (
    <View style={styles.container}>
      <Icon source={icon} width={16} height={16} />
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        testID={buildTestId(i18nKey)}
        accessible
        style={[textStyles.CaptionExtrabold, styles.text, colorStyle]}>
        {t(i18nKey)}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    flexGrow: 1,
  },
  text: {
    paddingLeft: spacing[1],
    lineHeight: 17,
    flex: 1,
  },
})
