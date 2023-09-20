import Clipboard from '@react-native-clipboard/clipboard'
import React, { useCallback, useState } from 'react'
import { StyleSheet, Text, View, ViewProps } from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import { Button } from '../../../components/button/button'
import { CopyToClipboard } from '../../../components/copy-to-clipboard/copy-to-clipboard'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { OrderEntry } from '../../../services/api/types/commerce/api-types'
import { useTranslation } from '../../../services/translation/translation'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import { textStyles } from '../../../theme/typography'
import { linkLogger, openLink } from '../../../utils/links/utils'

export type ReservationDetailPickupInfoProps = {
  orderEntry: OrderEntry
}

export const ReservationDetailPickupInfo: React.FC<ReservationDetailPickupInfoProps> = ({ orderEntry }) => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const [state, setState] = useState<{ containerWidth?: number }>({})

  const onContainerLayout: NonNullable<ViewProps['onLayout']> = useCallback(event => {
    const { width } = event.nativeEvent.layout
    setState(currentState => ({ ...currentState, containerWidth: width }))
  }, [])

  const onPressVoucherCodeCopy = useCallback(() => {
    if (!orderEntry.voucherCode) {
      return
    }

    Clipboard.setString(orderEntry.voucherCode)
  }, [orderEntry.voucherCode])

  const onPressVoucherRedemptionUrl = useCallback(async () => {
    if (!orderEntry.voucherRedemptionUrl) {
      return
    }

    await openLink(orderEntry.voucherRedemptionUrl).catch(linkLogger)
  }, [orderEntry.voucherRedemptionUrl])

  return (
    <View style={styles.container} onLayout={onContainerLayout}>
      {orderEntry.voucherCode ? (
        <>
          <TranslatedText
            i18nKey="reservationDetail_header_voucherScenario_pickup_voucherSection_headline"
            textStyle="CaptionSemibold"
            textStyleOverrides={[styles.voucherCodeHeadline, { color: colors.labelColor }]}
          />
          <Text style={styles.voucherCodeContainer} accessibilityLabel={orderEntry.voucherCode} />
          <CopyToClipboard
            baseTestId={'reservationDetail_header_voucherScenario_pickup_voucherSection_voucherCode'}
            copyToClipboardAccessibilityI18nKey={
              'reservationDetail_header_voucherScenario_pickup_voucherSection_copyToClipboard'
            }
            onPress={onPressVoucherCodeCopy}
            style={styles.voucherCodeCopyIcon}
          />
        </>
      ) : null}
      {orderEntry.voucherRedemptionUrl ? (
        <Button
          variant="tertiary"
          i18nKey="reservationDetail_header_voucherScenario_pickup_voucherSection_redeemButton"
          iconSource="link-arrow"
          iconPosition="left"
          widthOption="grow"
          bodyStyleOverrides={styles.voucherRedemptionUrlButton}
          onPress={onPressVoucherRedemptionUrl}
          accessibilityHint={t('external_link_accessibility_announcement')}
        />
      ) : null}
      {orderEntry.barcodeDisplayType === 'QR_CODE' && orderEntry.barcodeData ? (
        <View
          accessible
          accessibilityRole="image"
          accessibilityLabel={t('reservationDetail_qrCode_dataDescription')}
          accessibilityHint={t('reservationDetail_qrCode_hint')}
          style={styles.qrFrame}>
          <QRCode value={orderEntry.barcodeData} size={state.containerWidth} />
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  voucherCodeHeadline: {
    ...textStyles.CaptionSemibold,
    marginBottom: spacing[2],
  },
  voucherCodeContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: spacing[6],
  },
  voucherCodeCopyIcon: {
    marginLeft: spacing[5],
  },
  voucherRedemptionUrlButton: {
    marginBottom: spacing[7],
  },
  qrFrame: {
    padding: spacing[4],
    backgroundColor: 'white',
    borderRadius: 8,
  },
})
