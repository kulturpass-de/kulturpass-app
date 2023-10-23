import React from 'react'
import { CancelConfirmAlert } from '../../../../components/cancel-confirm-alert/cancel-confirm-alert'
import { useTestIdBuilder } from '../../../../services/test-id/test-id'

export type CancelRegistrationAlertProps = {
  visible: boolean
  onDismiss: () => void
  onConfirmCancelation: () => void
}

export const CancelRegistrationAlert: React.FC<CancelRegistrationAlertProps> = props => {
  const { buildTestId } = useTestIdBuilder()
  return (
    <CancelConfirmAlert
      {...props}
      testID={buildTestId('registration_cancel_alert')}
      i18nKeyTitle="registration_cancel_alert_title"
      i18nKeyText="registration_cancel_alert_text"
      i18nKeyDismissButton="registration_cancel_dismiss_button"
      i18nKeyConfirmButton="registration_cancel_confirm_button"
    />
  )
}
