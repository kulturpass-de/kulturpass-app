import { useFocusEffect } from '@react-navigation/native'
import { SerializedError } from '@reduxjs/toolkit'
import React, { useCallback } from 'react'
import { Alert } from '../../../components/alert/alert'
import { AlertButtonDismiss } from '../../../components/alert/alert-button-dismiss'
import { AlertContent } from '../../../components/alert/alert-content'
import { AlertMessage } from '../../../components/alert/alert-message'
import { AlertTitle } from '../../../components/alert/alert-title'
import useAccessibilityFocus from '../../../navigation/a11y/use-accessibility-focus'
import { ErrorWithCode } from '../../../services/errors/errors'
import { toErrorWithCode } from '../../../services/errors/serialized-error'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { getErrorDescriptionTranslationFromErrorWithCode } from '../utils/form-validation'

export type ErrorAlertError = ErrorWithCode | SerializedError

export type ErrorAlertProps = {
  error: ErrorAlertError | undefined
  onDismiss: (error: undefined) => void
}

export const ErrorAlert = ({ error, onDismiss }: ErrorAlertProps) => {
  const { buildTestId } = useTestIdBuilder()
  const [focusRef, setFocus] = useAccessibilityFocus()
  useFocusEffect(setFocus)

  const errorWithCode = error instanceof ErrorWithCode ? error : toErrorWithCode(error)

  const onErrorAlertChange = useCallback(
    (visible: boolean) => {
      if (!visible) {
        onDismiss(undefined)
      }
    },
    [onDismiss],
  )

  const errorDescription = getErrorDescriptionTranslationFromErrorWithCode(errorWithCode)

  return (
    <Alert visible={error !== undefined} onChange={onErrorAlertChange} dismissable={true}>
      <AlertContent ref={focusRef}>
        <AlertTitle i18nKey={errorDescription.title.key} testID={buildTestId('error_alert_title')} />
        <AlertMessage
          i18nKey={errorDescription.message.key}
          i18nParams={errorDescription.message.values}
          testID={buildTestId('error_alert_message')}
        />
        {errorWithCode?.presentableErrorCode ? (
          <AlertMessage
            i18nKey="error_alert_message_details"
            i18nParams={{ errorCode: errorWithCode?.errorCode, detailCode: errorWithCode?.detailCode }}
            testID={buildTestId('error_alert_message_details')}
          />
        ) : null}

        {errorWithCode?.errorDetails ? (
          <AlertMessage
            i18nKey="error_alert_message_details_extra"
            i18nParams={{ errorDetails: errorWithCode?.errorDetails }}
            testID={buildTestId('error_alert_message_details_extra')}
          />
        ) : null}
        <AlertButtonDismiss i18nKey="error_alert_cta" testID={buildTestId('error_alert_cta')} />
      </AlertContent>
    </Alert>
  )
}
