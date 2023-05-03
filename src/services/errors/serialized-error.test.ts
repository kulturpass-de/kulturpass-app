import { SerializedError } from '@reduxjs/toolkit'
import { CcOAuthClientError } from './cc-errors'
import { CdcEmailNotVerifiedError } from './cdc-errors'
import { HttpStatusBadRequestError } from './errors'
import { toErrorWithCode } from './serialized-error'

test('Should transform serialized cc error', () => {
  const serializedError: SerializedError = {
    code: 'CC_OAUTH_CLIENT_ERROR',
  }
  const errorWithCode = toErrorWithCode(serializedError)
  expect(errorWithCode).toBeDefined()
  expect(errorWithCode instanceof CcOAuthClientError).toBeTruthy()
  if (errorWithCode === undefined) {
    throw new Error('Should not happen')
  }
  expect(errorWithCode.errorCode).toBe('CC_OAUTH_CLIENT_ERROR')
  expect(errorWithCode.detailCode).toBe(
    'Commerce OAuth token request failed with an unspecified client error (status code 400 - 499)',
  )
})

test('Should transform serialized cdc error', () => {
  const serializedError: SerializedError = {
    code: 'CDC_EMAIL_NOT_VERIFIED',
  }
  const errorWithCode = toErrorWithCode(serializedError)
  expect(errorWithCode).toBeDefined()
  expect(errorWithCode instanceof CdcEmailNotVerifiedError).toBeTruthy()
  if (errorWithCode === undefined) {
    throw new Error('Should not happen')
  }
  expect(errorWithCode.errorCode).toBe('CDC_EMAIL_NOT_VERIFIED')
  expect(errorWithCode.detailCode).toBe('Cdc network request failed.')
})

test('Should transform serialized app error', () => {
  const serializedError: SerializedError = {
    code: 'HTTP_STATUS_BAD_REQUEST',
  }
  const errorWithCode = toErrorWithCode(serializedError)
  expect(errorWithCode).toBeDefined()
  expect(errorWithCode instanceof HttpStatusBadRequestError).toBeTruthy()
  if (errorWithCode === undefined) {
    throw new Error('Should not happen')
  }
  expect(errorWithCode.errorCode).toBe('HTTP_STATUS_BAD_REQUEST')
  expect(errorWithCode.detailCode).toBe('Network request failed with status code 400 (Bad Request)')
})
