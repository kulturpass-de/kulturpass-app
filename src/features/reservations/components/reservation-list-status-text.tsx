import React, { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { SvgImage, SvgImageProps } from '../../../components/svg-image/svg-image'
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
import { reservationListStatusTextColors as reservationListStatusTextColorsDark } from '../../../theme/dark/color-mappings'
import { useTheme } from '../../../theme/hooks/use-theme'
import { reservationListStatusTextColors as reservationListStatusTextColorsLight } from '../../../theme/light/color-mappings'
import { spacing } from '../../../theme/spacing'
import { ReservationListStatusTextColors } from '../../../theme/types'
import { textStyles } from '../../../theme/typography'

export type ReservationListStatusTextProps = {
  status: string
  deliveryScenario?: string
}

export const ReservationListStatusText: React.FC<ReservationListStatusTextProps> = ({ status, deliveryScenario }) => {
  const { t } = useTranslation()
  const { colorScheme } = useTheme()
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()

  const colors: ReservationListStatusTextColors = useMemo(() => {
    if (colorScheme === 'dark') {
      return reservationListStatusTextColorsDark
    } else {
      return reservationListStatusTextColorsLight
    }
  }, [colorScheme])

  const { icon, color }: { icon: SvgImageProps['type']; color: string } = useMemo(() => {
    const textColor = colors[status as keyof ReservationListStatusTextColors] ?? colors.default
    switch (status) {
      case ORDER_STATUS_READY_FOR_PICKUP:
        return { icon: 'ready', color: textColor }
      case ORDER_STATUS_RECEIVED:
      case ORDER_STATUS_COMPLETED:
        return { icon: 'completed', color: textColor }
      case ORDER_STATUS_CANCELLING:
        return { icon: 'cancelled', color: textColor }
      case ORDER_STATUS_CANCELLED:
        return { icon: 'cancelled', color: textColor }
      default:
        return { icon: 'processing', color: textColor }
    }
  }, [colors, status])

  const colorStyle = { color }

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
      <SvgImage testID={addTestIdModifier(i18nKey, 'icon')} type={icon} width={16} height={16} />
      <Text
        testID={buildTestId(i18nKey)}
        accessibilityLabel={t(i18nKey)}
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
