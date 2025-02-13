import { z } from 'zod'

export class ErrorWithCode extends Error {
  errorCode: string
  detailCode?: string
  errorDetails?: string
  subject?: string //This was added as part of the new feature for FlixTrain Error Handling.
  parent?: ErrorWithCode
  presentableErrorCode = true // For certain errors, you can choose to opt-out to display the error code.
  presentableError = true // For certain errors, you can choose to opt-out to display the error.

  constructor(errorCode: string, detailCode?: string, subject?: string) {
    super(`Unknown error with error code "${errorCode}".`)
    this.errorCode = errorCode
    this.detailCode = detailCode
    this.subject = subject
  }
}

export class OfflineError extends ErrorWithCode {
  constructor() {
    super('OFFLINE_ERROR')
    this.detailCode = 'You are offline.'
    this.presentableErrorCode = false
  }
}
export class NetworkError extends ErrorWithCode {
  constructor(errorResponse: string | null = null) {
    super('NETWORK_ERROR')
    this.detailCode = errorResponse ?? 'Unknown Network request failed.'
  }
}

export class HttpError extends ErrorWithCode {
  statusCode?: number
  errors?: ErrorType[] = []

  constructor(responseBody: unknown, statusCode: number, errorCode: string = 'HTTP_ERROR') {
    super(errorCode)
    this.statusCode = statusCode
    this.detailCode = 'Network request failed with unknown error.'

    const parsed = ResponseBodySchema.safeParse(responseBody)
    if (parsed.success) {
      this.errors = parsed.data.errors
      this.errorDetails = parsed.data.errorDetails
    }
  }
}

export class HttpClientError extends HttpError {
  statusCode: number

  constructor(responseBody: unknown, statusCode: number, errorCode: string = 'HTTP_CLIENT_ERROR') {
    super(responseBody, statusCode, errorCode)
    this.statusCode = statusCode
    this.detailCode = 'Network request with an unspecified client error (status code 400 - 499)'
  }
}

export class HttpServerError extends HttpError {
  statusCode: number

  constructor(responseBody: unknown, statusCode: number, errorCode: string = 'HTTP_SERVER_ERROR') {
    super(responseBody, statusCode, errorCode)
    this.statusCode = statusCode
    this.detailCode = 'Network request with an unspecified server error (status code 500 - 599)'
  }
}

export class HttpStatusBadRequestError extends HttpClientError {
  constructor(responseBody: unknown) {
    super(responseBody, 400, 'HTTP_STATUS_BAD_REQUEST')
    this.detailCode = 'Network request failed with status code 400 (Bad Request)'

    // opt-out the error code to be presentable to the user
    this.presentableErrorCode = !this.isInsufficientBalanceError()

    // opt-out the error to be presentable to the user
    this.presentableError = !this.shouldHideError()
  }

  shouldHideError(): boolean {
    return (
      this.errors?.find(({ type }) => ['JaloObjectNoLongerValidError', 'NoSuchFavouritesEntry'].includes(type)) !==
      undefined
    )
  }

  isInsufficientBalanceError(): boolean {
    return this.errors?.find(({ type }) => type === 'InsufficientBalanceError') !== undefined
  }
}

export class HttpStatusForbiddenError extends HttpClientError {
  constructor(responseBody: unknown, errorCode: string = 'HTTP_STATUS_FORBIDDEN') {
    super(responseBody, 403, errorCode)
    this.detailCode = 'Network request failed with status code 403 (Forbidden)'
  }
}

export class HttpStatusInternalServerError extends HttpServerError {
  constructor(responseBody: unknown, errorCode: string = 'HTTP_STATUS_INTERNAL_SERVER_ERROR') {
    super(responseBody, 500, errorCode)
    this.detailCode = 'Network request failed with status code 500 (Internal Server Error)'
  }
}

export class HttpStatusNotFoundError extends HttpClientError {
  constructor(responseBody: unknown, errorCode: string = 'HTTP_STATUS_NOT_FOUND') {
    super(responseBody, 404, errorCode)
    this.detailCode = 'Network request failed with status code 404 (Not Found)'
  }
}

export class HttpStatusServiceUnavailableError extends HttpServerError {
  constructor(responseBody: unknown, errorCode: string = 'HTTP_STATUS_SERVICE_UNAVAILABLE') {
    super(responseBody, 503, errorCode)
    this.detailCode = 'Network request failed with status code 503 (Service Unavailable)'
  }
}

export class HttpStatusTooManyRequestsError extends HttpClientError {
  constructor(responseBody: unknown, errorCode: string = 'HTTP_STATUS_TOO_MANY_REQUESTS') {
    super(responseBody, 429, errorCode)
    this.detailCode = 'Network request failed with status code 429 (Too Many Requests)'
  }
}

const ErrorTypeSchema = z.object({
  type: z.string(),
  message: z.string(),
  subject: z.string().optional(),
})

type ErrorType = z.infer<typeof ErrorTypeSchema>

const ResponseBodySchema = z.object({
  errors: z.optional(z.array(ErrorTypeSchema)),
  errorDetails: z.undefined().or(z.string()),
})

export class HttpStatusUnauthorizedError extends HttpClientError {
  constructor(responseBody: unknown) {
    super(responseBody, 401, 'HTTP_STATUS_UNAUTHORIZED')
    this.detailCode = 'Network request failed with status code 401 (Unauthorized)'

    const parsed = ResponseBodySchema.safeParse(responseBody)
    if (parsed.success) {
      this.errors = parsed.data.errors
      this.errorDetails = parsed.data.errorDetails
    }
  }
}

export class UnknownError extends ErrorWithCode {
  constructor(errorCode: string = 'UNKNOWN') {
    super(errorCode)
    this.detailCode = 'An unknown error occurred.'
  }
}

export const createHttpErrorFromStatusCode = (statusCode: number, responseBody?: unknown): HttpError => {
  switch (statusCode) {
    case 400:
      return new HttpStatusBadRequestError(responseBody)
    case 401:
      return new HttpStatusUnauthorizedError(responseBody)
    case 403:
      return new HttpStatusForbiddenError(responseBody)
    case 404:
      return new HttpStatusNotFoundError(responseBody)
    case 429:
      return new HttpStatusTooManyRequestsError(responseBody)
    case 500:
      return new HttpStatusInternalServerError(responseBody)
    case 503:
      return new HttpStatusServiceUnavailableError(responseBody)
  }

  if (statusCode >= 400 && statusCode <= 499) {
    return new HttpClientError(responseBody, statusCode)
  }

  if (statusCode >= 500 && statusCode <= 599) {
    return new HttpServerError(responseBody, statusCode)
  }

  return new HttpError(responseBody, statusCode)
}

export const createErrorFromErrorCode = (errorCode: string, detailCode?: string): ErrorWithCode => {
  return new ErrorWithCode(errorCode, detailCode)
}

export const mapAppErrorCodeToError = (
  errorCode: string,
  statusCode = -1,
  responseBody?: unknown,
): ErrorWithCode | null => {
  switch (errorCode) {
    case 'NETWORK_ERROR':
      return new NetworkError()
    case 'HTTP_ERROR':
      return new HttpError(responseBody, statusCode)
    case 'HTTP_CLIENT_ERROR':
      return new HttpClientError(responseBody, statusCode)
    case 'HTTP_SERVER_ERROR':
      return new HttpServerError(responseBody, statusCode)
    case 'HTTP_STATUS_BAD_REQUEST':
      return new HttpStatusBadRequestError(responseBody)
    case 'HTTP_STATUS_FORBIDDEN':
      return new HttpStatusForbiddenError(responseBody)
    case 'HTTP_STATUS_INTERNAL_SERVER_ERROR':
      return new HttpStatusInternalServerError(responseBody)
    case 'HTTP_STATUS_NOT_FOUND':
      return new HttpStatusNotFoundError(responseBody)
    case 'HTTP_STATUS_SERVICE_UNAVAILABLE':
      return new HttpStatusServiceUnavailableError(responseBody)
    case 'HTTP_STATUS_TOO_MANY_REQUESTS':
      return new HttpStatusTooManyRequestsError(responseBody)
    case 'HTTP_STATUS_UNAUTHORIZED':
      return new HttpStatusUnauthorizedError(responseBody)
    case 'UNKNOWN':
      return new UnknownError('Invalid ErrorCode')
  }

  return null
}
