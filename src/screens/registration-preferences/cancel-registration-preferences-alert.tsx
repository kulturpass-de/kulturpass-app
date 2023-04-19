import React from 'react'
import { CancelConfirmAlert } from '../../components/cancel-confirm-alert/cancel-confirm-alert'

export type CancelRegistrationPreferencesAlertProps = {
  visible: boolean
  onDismiss: () => void
  onConfirmCancelation: () => void
}

export const CancelRegistrationPreferencesAlert: React.FC<CancelRegistrationPreferencesAlertProps> = props => {
  return (
    <CancelConfirmAlert
      {...props}
      testID="registration_preferences_cancel_alert"
      i18nKeyTitle="registration_preferences_cancel_alert_title"
      i18nKeyText="registration_preferences_cancel_alert_text"
      i18nKeyDismissButton="registration_preferences_cancel_dismiss_button"
      i18nKeyConfirmButton="registration_preferences_cancel_confirm_button"
    />
  )
}
