import { useFocusEffect } from '@react-navigation/native'
import React from 'react'
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

export type MobilityOffersErrorAlertProps = {
  onChange: (visible: boolean) => void
  handleCancel: () => void
  visible: boolean
}

export const MobilityOffersErrorAlert: React.FC<MobilityOffersErrorAlertProps> = ({
  handleCancel,
  visible,
  onChange,
}) => {
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const testID = buildTestId('mobility_offers_error_alert')
  const { colors } = useTheme()

  const [focusRef, setFocus] = useAccessibilityFocus()
  useFocusEffect(setFocus)

  return (
    <Alert visible={visible} onChange={onChange}>
      <AlertContent ref={focusRef} style={styles.container}>
        <AlertTitle testID={addTestIdModifier(testID, 'title')} i18nKey="mobility-offers-error-alert-title" />
        <TranslatedText
          textStyleOverrides={[styles.text, { color: colors.labelColor }]}
          i18nKey={'mobility-offers-ft-access-denied-text'}
          testID={addTestIdModifier(testID, 'error')}
          textStyle="BodyRegular"
        />
        <View style={styles.spacer} />
        <Button
          testID={addTestIdModifier(testID, 'ok_button')}
          i18nKey="mobility-offers-ft-error-Page-Ok-text"
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
