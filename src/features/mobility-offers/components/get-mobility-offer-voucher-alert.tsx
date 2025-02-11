import { useFocusEffect } from '@react-navigation/native'
import React, { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { Alert } from '../../../components/alert/alert'
import { AlertContent } from '../../../components/alert/alert-content'
import { AlertTitle } from '../../../components/alert/alert-title'
import { Button } from '../../../components/button/button'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import useAccessibilityFocus from '../../../navigation/a11y/use-accessibility-focus'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import { formatFullDate } from '../../../utils/date/date-format'
import { ClaimVoucherCampaignResponse } from '../types/mobility-voucher-campaign-types'

export type GetMobilityOffersVoucherAlertProps = {
  onChange: (visible: boolean) => void
  getVoucherCode: () => void
  voucherData: ClaimVoucherCampaignResponse
  visible: boolean
  handleCancel: () => void
}

export const GetMobilityOffersVoucherAlert: React.FC<GetMobilityOffersVoucherAlertProps> = ({
  visible,
  getVoucherCode,
  onChange,
  voucherData,
  handleCancel,
}) => {
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const testID = buildTestId('mobility_offers_get_code_alert')
  const { colors } = useTheme()

  const [focusRef, setFocus] = useAccessibilityFocus()
  useFocusEffect(setFocus)

  const formattedDate = useMemo(() => {
    return voucherData?.validityPeriodEnd ? formatFullDate(new Date(voucherData?.validityPeriodEnd)) : undefined
  }, [voucherData?.validityPeriodEnd])

  return (
    <Alert visible={visible} onChange={onChange}>
      <AlertContent ref={focusRef} style={styles.container}>
        <AlertTitle testID={addTestIdModifier(testID, 'title')} i18nKey="mobility-offers-get-code-alert-title" />
        <TranslatedText
          textStyleOverrides={[styles.text, { color: colors.labelColor }]}
          i18nKey="mobility-offers-get-code-text"
          i18nParams={{
            validityInHours: voucherData?.validityInHours,
            validTo: formattedDate,
          }}
          testID={addTestIdModifier(testID, 'text')}
          textStyle="BodyRegular"
        />
        <View style={styles.spacer} />
        <Button
          testID={addTestIdModifier(testID, 'get_code_now_button')}
          i18nKey="mobility-offers-get-code-now-button_text"
          variant="primary"
          onPress={getVoucherCode}
        />
        <Button
          testID={addTestIdModifier(testID, 'later_button')}
          i18nKey="mobility-offers-get-code-later-button_text"
          variant="white"
          onPress={handleCancel}
          bodyStyleOverrides={styles.cancelButton}
        />
      </AlertContent>
    </Alert>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignContent: 'center',
  },
  text: {
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  spacer: {
    height: spacing[6],
  },
  cancelButton: {
    paddingTop: spacing[2],
  },
})
