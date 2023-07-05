import { useFocusEffect } from '@react-navigation/native'
import React from 'react'
import { useCallback } from 'react'
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

export const ConfirmCancellationAlert = ({ visible, onConfirm, onDismiss }: ConfirmCancellationAlertProps) => {
  const { buildTestId } = useTestIdBuilder()
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
        <AlertTitle
          i18nKey="cancellation_confirmation_alert_title"
          testID={buildTestId('canellation_confirmation_alert_title')}
        />
        <AlertMessage
          i18nKey="cancellation_confirmation_alert_description"
          testID={buildTestId('canellation_confirmation_alert_message')}
        />
        <Button
          i18nKey="cancellation_confirmation_alert_confirm_button"
          testID={buildTestId('cancellation_confirmation_alert_confirm_button')}
          onPress={onConfirm}
        />
        <AlertButtonDismiss
          i18nKey="cancellation_confirmation_alert_cancel_button"
          testID={buildTestId('cancellation_confirmation_alert_cancel_button')}
          variant="transparent"
        />
      </AlertContent>
    </Alert>
  )
}
