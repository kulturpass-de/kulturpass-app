import { useFocusEffect } from '@react-navigation/native'
import React from 'react'
import { StyleSheet } from 'react-native'
import { Alert } from '../../../components/alert/alert'
import { AlertContent } from '../../../components/alert/alert-content'
import { AlertMessage } from '../../../components/alert/alert-message'
import { AlertTitle } from '../../../components/alert/alert-title'
import { Button } from '../../../components/button/button'
import useAccessibilityFocus from '../../../navigation/a11y/use-accessibility-focus'
import { useTestIdBuilder } from '../../../services/test-id/test-id'

export type UpdateProfileAlertProps = {
  visible: boolean
  onDiscard: () => void
  onDismiss: () => void
}

export const UpdateProfileAlert: React.FC<UpdateProfileAlertProps> = ({ visible, onDiscard, onDismiss }) => {
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const testID = buildTestId('update_profile_alert')

  const [focusRef, setFocus] = useAccessibilityFocus()
  useFocusEffect(setFocus)

  return (
    <Alert visible={visible}>
      <AlertContent ref={focusRef} style={styles.container}>
        <AlertTitle testID={addTestIdModifier(testID, 'title')} i18nKey="editPreferences_alert_title" />
        <AlertMessage i18nKey="editPreferences_alert_text" testID={addTestIdModifier(testID, 'text')} />
        <Button
          testID={addTestIdModifier(testID, 'discard')}
          i18nKey="editPreferences_alert_discard"
          variant="primary"
          onPress={onDiscard}
        />
        <Button
          testID={addTestIdModifier(testID, 'dismiss')}
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
})
