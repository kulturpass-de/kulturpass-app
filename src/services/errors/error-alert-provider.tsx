import React from 'react'
import { createRef, PropsWithChildren, useCallback, useImperativeHandle, useState } from 'react'
import { ErrorAlert } from '../../features/form-validation/components/error-alert'
import { ErrorWithCode } from './errors'

export type ErrorAlertManagerHandler = {
  showError: (error: ErrorWithCode) => void
  dismiss: () => void
}

export const ErrorAlertManager = createRef<ErrorAlertManagerHandler>()

export const ErrorAlertProvider = ({ children }: PropsWithChildren) => {
  const [error, setError] = useState<ErrorWithCode | undefined>(undefined)

  useImperativeHandle(ErrorAlertManager, (): ErrorAlertManagerHandler => {
    return {
      showError: (newError: ErrorWithCode) => {
        setError(newError)
      },
      dismiss: () => {
        setError(undefined)
      },
    }
  })

  const onDismiss = useCallback(() => {
    setError(undefined)
  }, [])

  return (
    <>
      {children}
      <ErrorAlert error={error} onDismiss={onDismiss} />
    </>
  )
}
