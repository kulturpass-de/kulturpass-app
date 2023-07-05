import { SerializedError } from '@reduxjs/toolkit'
import { useCallback, useEffect, useState } from 'react'
import { ErrorWithCode } from './errors'

export const useDismissableError = (error: ErrorWithCode | SerializedError | undefined) => {
  const [visibleError, setVisibleError] = useState<ErrorWithCode | SerializedError | undefined>()
  useEffect(() => {
    setVisibleError(error)
  }, [error])
  const onDismissVisibleError = useCallback(() => {
    setVisibleError(undefined)
  }, [])
  return {
    visibleError,
    onDismissVisibleError,
  }
}
