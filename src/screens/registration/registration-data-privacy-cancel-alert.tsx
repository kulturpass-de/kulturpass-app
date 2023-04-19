import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { Alert } from '../../components/alert/alert'
import { AlertContent } from '../../components/alert/alert-content'
import { AlertMessage } from '../../components/alert/alert-message'
import { AlertTitle } from '../../components/alert/alert-title'
import { Button } from '../../components/button/button'
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
  const { buildTestId } = useTestIdBuilder()

  return (
    <Alert visible={visible} onChange={setVisible}>
      <AlertContent>
        <AlertTitle
          testID={buildTestId('registration_data_privacy_cancel_dialog_title')}
          i18nKey="registration_data_privacy_cancel_dialog_title"
        />
        <AlertMessage
          testID={buildTestId('registration_data_privacy_cancel_dialog_message')}
          i18nKey="registration_data_privacy_cancel_dialog_message"
        />
        <Button
          testID={buildTestId('registration_data_privacy_cancel_dialog_dismiss_button')}
          i18nKey="registration_data_privacy_cancel_dialog_dismiss_button"
          onPress={onDismiss}
        />
        <Button
          testID={buildTestId('registration_data_privacy_cancel_dialog_cancel_button')}
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
