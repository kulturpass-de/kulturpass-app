import React, { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Icon, IconProps } from '../../../components/icon/icon'
import {
  DELIVERY_SCENARIO_IN_APP_VOUCHER,
  DELIVERY_SCENARIO_PICKUP,
  ORDER_STATUS_CANCELLING,
  ORDER_STATUS_CANCELLED,
  ORDER_STATUS_COMPLETED,
  ORDER_STATUS_CREATED,
  ORDER_STATUS_READY_FOR_PICKUP,
  ORDER_STATUS_RECEIVED,
  ORDER_STATUS_SHIPPING,
} from '../../../services/api/types/commerce/commerce-get-reservations'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { colors } from '../../../theme/colors'
import { spacing } from '../../../theme/spacing'
import { textStyles } from '../../../theme/typography'

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
      case ORDER_STATUS_CANCELLING:
        return { icon: 'Cancelled', color: 'redDarkest' }
      case ORDER_STATUS_CANCELLED:
        return { icon: 'Cancelled', color: 'redDarkest' }
      default:
        return { icon: 'Processing', color: 'primaryDarkest' }
    }
  }, [status])

  const colorStyle = { color: colors[color] }

  const i18nKey = useMemo(() => {
    if (status === ORDER_STATUS_CREATED || status === ORDER_STATUS_SHIPPING) {
      const statusLowerCase = status.toLowerCase() as Lowercase<typeof status>
      return `reservations_list_state_${statusLowerCase}` as const
    } else if (status === ORDER_STATUS_CANCELLING || status === ORDER_STATUS_CANCELLED) {
      return 'reservations_list_state_cancelled'
    } else if (
      (deliveryScenario === DELIVERY_SCENARIO_PICKUP || deliveryScenario === DELIVERY_SCENARIO_IN_APP_VOUCHER) &&
      (status === ORDER_STATUS_READY_FOR_PICKUP ||
        status === ORDER_STATUS_RECEIVED ||
        status === ORDER_STATUS_COMPLETED)
    ) {
      const statusLowerCase = status.toLowerCase() as Lowercase<typeof status>
      const deliveryScenarioLowerCase = deliveryScenario.toLowerCase() as Lowercase<typeof deliveryScenario>
      return `reservations_list_state_${statusLowerCase}_${deliveryScenarioLowerCase}` as const
    } else {
      return undefined
    }
  }, [status, deliveryScenario])

  if (!i18nKey) {
    return null
  }

  return (
    <View style={styles.container}>
      <Icon source={icon} width={16} height={16} />
      <Text testID={buildTestId(i18nKey)} accessible style={[textStyles.CaptionExtrabold, styles.text, colorStyle]}>
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
