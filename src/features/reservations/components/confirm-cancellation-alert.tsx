import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { Alert } from '../../../components/alert/alert'
import { AlertButtonDismiss } from '../../../components/alert/alert-button-dismiss'
import { AlertContent } from '../../../components/alert/alert-content'
import { AlertMessage } from '../../../components/alert/alert-message'
import { AlertTitle } from '../../../components/alert/alert-title'
import { Button } from '../../../components/button/button'
import useAccessibilityFocus from '../../../navigation/a11y/use-accessibility-focus'
import { useTestIdBuilder } from '../../../services/test-id/test-id'

export type ConfirmCancellationAlertProps = {
  visible: boolean
  onConfirm: () => void
  onDismiss: () => void
}

export const ConfirmCancellationAlert: React.FC<ConfirmCancellationAlertProps> = ({
  visible,
  onConfirm,
  onDismiss,
}) => {
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const testID = buildTestId('cancellation_confirmation_alert')
  const [focusRef, setFocus] = useAccessibilityFocus()
  useFocusEffect(setFocus)

  const onChange = useCallback(
    (newIsVisible: boolean) => {
      if (!newIsVisible) {
        onDismiss()
      }
    },
    [onDismiss],
  )

  return (
    <Alert visible={visible} onChange={onChange} dismissable={false}>
      <AlertContent ref={focusRef}>
        <AlertTitle i18nKey="cancellation_confirmation_alert_title" testID={addTestIdModifier(testID, 'title')} />
        <AlertMessage
          i18nKey="cancellation_confirmation_alert_description"
          testID={addTestIdModifier(testID, 'message')}
        />
        <Button
          i18nKey="cancellation_confirmation_alert_confirm_button"
          testID={addTestIdModifier(testID, 'confirm_button')}
          onPress={onConfirm}
        />
        <AlertButtonDismiss
          i18nKey="cancellation_confirmation_alert_cancel_button"
          testID={addTestIdModifier(testID, 'cancel_button')}
          variant="transparent"
        />
      </AlertContent>
    </Alert>
  )
}
