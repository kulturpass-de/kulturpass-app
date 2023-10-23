import { z } from 'zod'
import { ErrorWithCode } from './errors'

export class CdcError extends ErrorWithCode {
  constructor(errorBody?: CdcApiErrorResponseBody, errorCode: string = 'CDC_ERROR') {
    super(errorCode)
    this.detailCode = 'Cdc network request failed.'

    const parsed = CdcResponseErrorSchema.safeParse(errorBody)
    if (parsed.success) {
      this.errorDetails = parsed.data.errorDetails
    }
  }
}

export class CdcServerError extends CdcError {
  constructor(errorBody?: CdcApiErrorResponseBody, errorCode: string = 'CDC_SERVER_ERROR') {
    super(errorBody, errorCode)
  }
}

export class CdcClientError extends CdcError {
  constructor(errorBody?: CdcApiErrorResponseBody, errorCode: string = 'CDC_CLIENT_ERROR') {
    super(errorBody, errorCode)
  }
}

export class CdcStatusNotFoundError extends CdcError {
  constructor(errorBody?: CdcApiErrorResponseBody, errorCode: string = 'CDC_STATUS_NOT_FOUND') {
    super(errorBody, errorCode)
  }
}

export class CdcStatusForbiddenError extends CdcError {
  constructor(errorBody?: CdcApiErrorResponseBody, errorCode: string = 'CDC_STATUS_FORBIDDEN') {
    super(errorBody, errorCode)
  }
}

export class CdcStatusUnauthorizedError extends CdcError {
  constructor(errorBody?: CdcApiErrorResponseBody, errorCode: string = 'CDC_STATUS_UNAUTHORIZED') {
    super(errorBody, errorCode)
  }
}

export class CdcStatusBadRequestError extends CdcError {
  constructor(errorBody?: CdcApiErrorResponseBody, errorCode: string = 'CDC_STATUS_BAD_REQUEST') {
    super(errorBody, errorCode)
  }
}

export class CdcInvalidLoginIdError extends CdcError {
  constructor(errorBody?: CdcApiErrorResponseBody, errorCode: string = 'CDC_INVALID_LOGINID') {
    super(errorBody, errorCode)
  }
}

export class CdcInvalidLoginIdDeleteError extends CdcError {
  constructor(errorBody?: CdcApiErrorResponseBody, errorCode: string = 'CDC_INVALID_LOGINID_DELETE') {
    super(errorBody, errorCode)
  }
}

export class CdcLoginIdNotExistingError extends CdcError {
  constructor(errorBody?: CdcApiErrorResponseBody, errorCode: string = 'CDC_LOGINID_NOT_EXISTING') {
    super(errorBody, errorCode)
  }
}

export class CdcAccountDisabledError extends CdcError {
  constructor(errorBody?: CdcApiErrorResponseBody, errorCode: string = 'CDC_ACCOUNT_DISABLED') {
    super(errorBody, errorCode)
  }
}

export class CdcAccountDeletionRequestedError extends CdcError {
  constructor(errorBody?: CdcApiErrorResponseBody, errorCode: string = 'CDC_ACCOUNT_DELETION_REQUESTED') {
    super(errorBody, errorCode)
    this.detailCode = 'Cdc account deletion requested.'
  }
}

export class CdcEmailNotVerifiedError extends CdcError {
  constructor(errorBody?: CdcApiErrorResponseBody, errorCode: string = 'CDC_EMAIL_NOT_VERIFIED') {
    super(errorBody, errorCode)
  }
}

export class CdcStatusValidationError extends CdcError {
  validationErrors: CdcResponseValidationError[]

  constructor(validationErrors: CdcResponseValidationError[], errorCode: string = 'CDC_STATUS_VALIDATION_ERROR') {
    super(undefined, errorCode)
    this.validationErrors = validationErrors
  }
}

export class CdcStatusInvalidParameter extends CdcError {
  invalidParameter: CdcResponseInvalidParameter

  constructor(invalidParameter: CdcApiErrorResponseBody, errorCode: string = 'CDC_STATUS_INVALID_PARAMETER') {
    super(invalidParameter, errorCode)
    this.invalidParameter = invalidParameter
  }
}

export const CDC_ERROR_CODES: Array<[RegExp, string]> = [
  [/400006/, 'CDC_STATUS_INVALID_PARAMETER'],
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

export const CdcResponseInvalidParameterSchema = z.object({
  errorCode: z.number().min(300),
  errorDetails: z.string(),
})

export type CdcResponseInvalidParameter = z.infer<typeof CdcResponseInvalidParameterSchema>

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
    case 'CDC_STATUS_INVALID_PARAMETER':
      return new CdcStatusInvalidParameter(errorBody)
    case 'CDC_STATUS_VALIDATION_ERROR':
      return new CdcStatusValidationError(errorBody.validationErrors ?? [])
  }

  return mapCdcErrorCodeToError(appErrorCode, errorBody) ?? new CdcError(undefined)
}

export const mapCdcErrorCodeToError = (errorCode: string, errorBody?: CdcApiErrorResponseBody): CdcError | null => {
  switch (errorCode) {
    case 'CDC_STATUS_VALIDATION_ERROR':
      return new CdcStatusValidationError([])
    case 'CDC_EMAIL_NOT_VERIFIED':
      return new CdcEmailNotVerifiedError(errorBody)
    case 'CDC_ACCOUNT_DISABLED':
      return new CdcAccountDisabledError(errorBody)
    case 'CDC_INVALID_LOGINID':
      return new CdcInvalidLoginIdError(errorBody)
    case 'CDC_INVALID_LOGINID_DELETE':
      return new CdcInvalidLoginIdDeleteError(errorBody)
    case 'CDC_LOGINID_NOT_EXISTING':
      return new CdcLoginIdNotExistingError(errorBody)
    case 'CDC_STATUS_BAD_REQUEST':
      return new CdcStatusBadRequestError(errorBody)
    case 'CDC_STATUS_UNAUTHORIZED':
      return new CdcStatusUnauthorizedError(errorBody)
    case 'CDC_STATUS_FORBIDDEN':
      return new CdcStatusForbiddenError(errorBody)
    case 'CDC_STATUS_NOT_FOUND':
      return new CdcStatusNotFoundError(errorBody)
    case 'CDC_CLIENT_ERROR':
      return new CdcClientError(errorBody)
    case 'CDC_SERVER_ERROR':
      return new CdcServerError(errorBody)
  }

  return null
}
