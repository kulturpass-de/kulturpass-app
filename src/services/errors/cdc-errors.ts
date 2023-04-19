import { z } from 'zod'
import { ErrorWithCode } from './errors'

export class CdcError extends ErrorWithCode {
  constructor(errorCode: string = 'CDC_ERROR') {
    super(errorCode)
    this.detailCode = 'Cdc network request failed.'
  }
}

export class CdcServerError extends CdcError {
  constructor(errorCode: string = 'CDC_SERVER_ERROR') {
    super(errorCode)
  }
}

export class CdcClientError extends CdcError {
  constructor(errorCode: string = 'CDC_CLIENT_ERROR') {
    super(errorCode)
  }
}

export class CdcStatusNotFoundError extends CdcError {
  constructor(errorCode: string = 'CDC_STATUS_NOT_FOUND') {
    super(errorCode)
  }
}

export class CdcStatusForbiddenError extends CdcError {
  constructor(errorCode: string = 'CDC_STATUS_FORBIDDEN') {
    super(errorCode)
  }
}

export class CdcStatusUnauthorizedError extends CdcError {
  constructor(errorCode: string = 'CDC_STATUS_UNAUTHORIZED') {
    super(errorCode)
  }
}

export class CdcStatusBadRequestError extends CdcError {
  constructor(errorCode: string = 'CDC_STATUS_BAD_REQUEST') {
    super(errorCode)
  }
}

export class CdcInvalidLoginIdError extends CdcError {
  constructor(errorCode: string = 'CDC_INVALID_LOGINID') {
    super(errorCode)
  }
}

export class CdcLoginIdNotExistingError extends CdcError {
  constructor(errorCode: string = 'CDC_LOGINID_NOT_EXISTING') {
    super(errorCode)
  }
}

export class CdcAccountDisabledError extends CdcError {
  constructor(errorCode: string = 'CDC_ACCOUNT_DISABLED') {
    super(errorCode)
  }
}

export class CdcEmailNotVerifiedError extends CdcError {
  constructor(errorCode: string = 'CDC_EMAIL_NOT_VERIFIED') {
    super(errorCode)
  }
}

export class CdcStatusValidationError extends CdcError {
  validationErrors: CdcResponseValidationError[]

  constructor(validationErrors: CdcResponseValidationError[], errorCode: string = 'CDC_STATUS_VALIDATION_ERROR') {
    super(errorCode)
    this.validationErrors = validationErrors
  }
}

export const CDC_ERROR_CODES: Array<[RegExp, string]> = [
  [/400009/, 'CDC_STATUS_VALIDATION_ERROR'],
  [/400028/, 'CDC_EMAIL_NOT_VERIFIED'],
  [/403041/, 'CDC_ACCOUNT_DISABLED'],
  [/403042/, 'CDC_INVALID_LOGINID'],
  [/403047/, 'CDC_LOGINID_NOT_EXISTING'],
  [/^400\d*/, 'CDC_STATUS_BAD_REQUEST'],
  [/^401\d*/, 'CDC_STATUS_UNAUTHORIZED'],
  [/^403\d*/, 'CDC_STATUS_FORBIDDEN'],
  [/^404\d*/, 'CDC_STATUS_NOT_FOUND'],
  [/^4\d*/, 'CDC_CLIENT_ERROR'],
  [/^5\d*/, 'CDC_SERVER_ERROR'],
  [/^\d*/, 'CDC_ERROR'],
]

export const mapCdcErrorCodeToAppErrorCode = (cdcErrorCode: number): string => {
  const match = CDC_ERROR_CODES.find(([pattern]) => {
    return pattern.test(cdcErrorCode.toString())
  })

  if (match == null) {
    return 'CDC_ERROR'
  }

  const [, appErrorCode] = match
  return appErrorCode
}

export const CdcResponseValidationErrorSchema = z.object({
  errorCode: z.number().min(300),
  message: z.string(),
  fieldName: z.string(),
})

export type CdcResponseValidationError = z.infer<typeof CdcResponseValidationErrorSchema>

export const CdcResponseErrorSchema = z
  .object({
    callId: z.string().optional(),
    errorCode: z.number(),
    errorDetails: z.string(),
    errorMessage: z.string(),
    apiVersion: z.number().optional(),
    statusCode: z.number(),
    statusReason: z.string().optional(),
    time: z.string().optional(),
    validationErrors: z.array(CdcResponseValidationErrorSchema).optional(),
  })
  .refine(data => data.statusCode >= 300, {
    path: ['statusCode'],
  })

export type CdcApiErrorResponseBody = z.infer<typeof CdcResponseErrorSchema>

export const createCdcErrorFromSchema = (errorBody: CdcApiErrorResponseBody) => {
  const appErrorCode = mapCdcErrorCodeToAppErrorCode(errorBody.errorCode)

  switch (appErrorCode) {
    case 'CDC_STATUS_VALIDATION_ERROR':
      return new CdcStatusValidationError(errorBody.validationErrors ?? [])
    case 'CDC_EMAIL_NOT_VERIFIED':
      return new CdcEmailNotVerifiedError()
    case 'CDC_ACCOUNT_DISABLED':
      return new CdcAccountDisabledError()
    case 'CDC_INVALID_LOGINID':
      return new CdcInvalidLoginIdError()
    case 'CDC_LOGINID_NOT_EXISTING':
      return new CdcLoginIdNotExistingError()
    case 'CDC_STATUS_BAD_REQUEST':
      return new CdcStatusBadRequestError()
    case 'CDC_STATUS_UNAUTHORIZED':
      return new CdcStatusUnauthorizedError()
    case 'CDC_STATUS_FORBIDDEN':
      return new CdcStatusForbiddenError()
    case 'CDC_STATUS_NOT_FOUND':
      return new CdcStatusNotFoundError()
    case 'CDC_CLIENT_ERROR':
      return new CdcClientError()
    case 'CDC_SERVER_ERROR':
      return new CdcServerError()
  }

  return new CdcError()
}
