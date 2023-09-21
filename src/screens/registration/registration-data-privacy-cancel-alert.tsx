import { useFocusEffect } from '@react-navigation/native'
import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { Alert } from '../../components/alert/alert'
import { AlertContent } from '../../components/alert/alert-content'
import { AlertMessage } from '../../components/alert/alert-message'
import { AlertTitle } from '../../components/alert/alert-title'
import { Button } from '../../components/button/button'
import useAccessibilityFocus from '../../navigation/a11y/use-accessibility-focus'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { spacing } from '../../theme/spacing'

export type RegistrationDataPrivacyCancelAlertProps = {
  onDismiss: () => void
  onCancelRegistration: () => void
}

export const RegistrationDataPrivacyCancelAlert: React.FC<RegistrationDataPrivacyCancelAlertProps> = ({
  onDismiss,
  onCancelRegistration,
}) => {
  const [visible, setVisible] = useState<boolean>(true)
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const testID = buildTestId('registration_data_privacy_cancel_dialog')
  const [focusRef, setFocus] = useAccessibilityFocus()
  useFocusEffect(setFocus)

  return (
    <Alert visible={visible} onChange={setVisible}>
      <AlertContent ref={focusRef}>
        <AlertTitle
          testID={addTestIdModifier(testID, 'title')}
          i18nKey="registration_data_privacy_cancel_dialog_title"
        />
        <AlertMessage
          testID={addTestIdModifier(testID, 'message')}
          i18nKey="registration_data_privacy_cancel_dialog_message"
        />
        <Button
          testID={addTestIdModifier(testID, 'dismiss_button')}
          i18nKey="registration_data_privacy_cancel_dialog_dismiss_button"
          onPress={onDismiss}
        />
        <Button
          testID={addTestIdModifier(testID, 'cancel_button')}
          i18nKey="registration_data_privacy_cancel_dialog_cancel_button"
          onPress={onCancelRegistration}
          variant="secondary"
          bodyStyleOverrides={styles.cancelButton}
        />
      </AlertContent>
    </Alert>
  )
}

const styles = StyleSheet.create({
  cancelButton: {
    marginTop: spacing[5],
  },
})
