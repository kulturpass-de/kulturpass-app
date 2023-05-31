import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import { Icon } from '../../../components/icon/icon'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { colors } from '../../../theme/colors'
import { useTranslation } from '../../../services/translation/translation'
import { spacing } from '../../../theme/spacing'
import { Order } from '../../../services/api/types/commerce/api-types'

import BackdropSmall0 from '../assets/backdrop-small-0.svg'
import BackdropSmall1 from '../assets/backdrop-small-1.svg'
import BackdropSmall2 from '../assets/backdrop-small-2.svg'
import BackdropSmall3 from '../assets/backdrop-small-3.svg'
import BackdropSmall4 from '../assets/backdrop-small-4.svg'
import BackdropLarge0 from '../assets/backdrop-large-0.svg'
import BackdropLarge1 from '../assets/backdrop-large-1.svg'
import BackdropLarge2 from '../assets/backdrop-large-2.svg'
import BackdropLarge3 from '../assets/backdrop-large-3.svg'
import BackdropLarge4 from '../assets/backdrop-large-4.svg'
import { getBackgdropIndex, lastDigitOfString } from '../utils'
import { HITSLOP } from '../../../theme/constants'

const backdrops = {
  small: [BackdropSmall0, BackdropSmall1, BackdropSmall2, BackdropSmall3, BackdropSmall4],
  large: [BackdropLarge0, BackdropLarge1, BackdropLarge2, BackdropLarge3, BackdropLarge4],
} as const

export type ReservationDetailHeaderProps = {
  order: Order
  onClose: () => void
}

export const ReservationDetailHeader: React.FC<ReservationDetailHeaderProps> = ({ order, onClose }) => {
  const { t } = useTranslation()
  const { buildTestId } = useTestIdBuilder()

  const orderHasBarcode = order.status === 'READY_FOR_PICKUP' && order.entries?.find(() => true)?.barcodeData
  const currentBackdrops = backdrops[orderHasBarcode ? 'large' : 'small']
  const orderCodeLastDigit = lastDigitOfString(order.code)
  const backdropIndex = getBackgdropIndex(orderCodeLastDigit, currentBackdrops.length)
  const Backdrop = currentBackdrops[backdropIndex]
  const backdropStyle = orderHasBarcode ? styles.backdropLarge : styles.backdropSmall

  return (
    <View>
      <View style={styles.backdropContainer}>
        <Backdrop style={backdropStyle} />
      </View>
      <View style={styles.content}>
        <Pressable
          hitSlop={HITSLOP}
          style={styles.closeButton}
          testID={buildTestId('reservationDetail_header_deliveryScenario_pickup_closeButton')}
          accessibilityRole="button"
          accessibilityLabel={t('reservationDetail_header_deliveryScenario_pickup_closeButton')}
          onPress={onClose}>
          <Icon source="Close" width={24} height={24} />
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  backdropContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  backdropSmall: {
    aspectRatio: 390 / 300,
  },
  backdropLarge: {
    aspectRatio: 390 / 500,
  },
  content: {
    alignItems: 'flex-end',
    padding: spacing[5],
  },
  closeButton: {
    borderRadius: 24,
    height: spacing[8],
    width: spacing[8],
    backgroundColor: colors.basicWhite,
    opacity: 0.85,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
