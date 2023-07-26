import { useFocusEffect } from '@react-navigation/native'
import React from 'react'
import { StyleSheet } from 'react-native'
import { Alert } from '../../components/alert/alert'
import { AlertContent } from '../../components/alert/alert-content'
import { AlertTitle } from '../../components/alert/alert-title'
import { Button } from '../../components/button/button'
import { TranslatedText } from '../../components/translated-text/translated-text'
import useAccessibilityFocus from '../../navigation/a11y/use-accessibility-focus'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTheme } from '../../theme/hooks/use-theme'
import { spacing } from '../../theme/spacing'

export type PreferencesAlertProps = {
  visible: boolean
  onDiscard: () => void
  onDismiss: () => void
}

export const PreferencesAlert: React.FC<PreferencesAlertProps> = ({ visible, onDiscard, onDismiss }) => {
  const { buildTestId } = useTestIdBuilder()
  const { colors } = useTheme()

  const [focusRef, setFocus] = useAccessibilityFocus()
  useFocusEffect(setFocus)

  return (
    <Alert visible={visible}>
      <AlertContent ref={focusRef} style={styles.container}>
        <AlertTitle testID={buildTestId('editPreferences_alert_title')} i18nKey="editPreferences_alert_title" />
        <TranslatedText
          textStyleOverrides={[styles.text, { color: colors.labelColor }]}
          i18nKey="editPreferences_alert_text"
          testID={buildTestId('editPreferences_alert_text')}
          textStyle="BodyRegular"
        />
        <Button
          testID={buildTestId('editPreferences_alert_discard')}
          i18nKey="editPreferences_alert_discard"
          variant="primary"
          onPress={onDiscard}
        />
        <Button
          testID={buildTestId('editPreferences_alert_dismiss')}
          i18nKey="editPreferences_alert_dismiss"
          variant="white"
          onPress={onDismiss}
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
    marginBottom: spacing[6],
  },
})
