import { SerializedError } from '@reduxjs/toolkit'
import { mapCcErrorCodeToError } from './cc-errors'
import { mapCdcErrorCodeToError } from './cdc-errors'
import { ErrorWithCode, mapAppErrorCodeToError, UnknownError } from './errors'

export const toErrorWithCode = (serializedError: SerializedError | undefined): ErrorWithCode | undefined => {
  if (serializedError === undefined) {
    return undefined
  }

  if (!serializedError.code) {
    return new UnknownError('Serialized Error without Code')
  }

  const ccError = mapCcErrorCodeToError(serializedError.code)
  if (ccError) {
    return ccError
  }

  const cdcError = mapCdcErrorCodeToError(serializedError.code, undefined)
  if (cdcError) {
    return cdcError
  }

  const appError = mapAppErrorCodeToError(serializedError.code)
  if (appError) {
    return appError
  }

  return new ErrorWithCode(serializedError.code)
}
