import { z } from 'zod'

export class ErrorWithCode extends Error {
  errorCode: string
  detailCode?: string
  parent?: ErrorWithCode

  constructor(errorCode: string, detailCode?: string) {
    super(`Unknown error with error code "${errorCode}".`)
    this.errorCode = errorCode
    this.detailCode = detailCode
  }
}

export class NetworkError extends ErrorWithCode {
  constructor() {
    super('NETWORK_ERROR')
    this.detailCode = 'Network request failed.'
  }
}

export class HttpError extends ErrorWithCode {
  statusCode?: number

  constructor(statusCode: number, errorCode: string = 'HTTP_ERROR') {
    super(errorCode)
    this.statusCode = statusCode
    this.detailCode = 'Network request failed with unknown error.'
  }
}

export class HttpClientError extends HttpError {
  statusCode: number

  constructor(statusCode: number, errorCode: string = 'HTTP_CLIENT_ERROR') {
    super(statusCode, errorCode)
    this.statusCode = statusCode
    this.detailCode = 'Network request with an unspecified client error (status code 400 - 499)'
  }
}

export class HttpServerError extends HttpError {
  statusCode: number

  constructor(statusCode: number, errorCode: string = 'HTTP_SERVER_ERROR') {
    super(statusCode, errorCode)
    this.statusCode = statusCode
    this.detailCode = 'Network request with an unspecified server error (status code 500 - 599)'
  }
}

export class HttpStatusBadRequestError extends HttpClientError {
  constructor(errorCode: string = 'HTTP_STATUS_BAD_REQUEST') {
    super(400, errorCode)
    this.detailCode = 'Network request failed with status code 400 (Bad Request)'
  }
}

export class HttpStatusForbiddenError extends HttpClientError {
  constructor(errorCode: string = 'HTTP_STATUS_FORBIDDEN') {
    super(403, errorCode)
    this.detailCode = 'Network request failed with status code 403 (Forbidden)'
  }
}

export class HttpStatusInternalServerError extends HttpServerError {
  constructor(errorCode: string = 'HTTP_STATUS_INTERNAL_SERVER_ERROR') {
    super(500, errorCode)
    this.detailCode = 'Network request failed with status code 500 (Internal Server Error)'
  }
}

export class HttpStatusNotFoundError extends HttpClientError {
  constructor(errorCode: string = 'HTTP_STATUS_NOT_FOUND') {
    super(404, errorCode)
    this.detailCode = 'Network request failed with status code 404 (Not Found)'
  }
}

export class HttpStatusServiceUnavailableError extends HttpServerError {
  constructor(errorCode: string = 'HTTP_STATUS_SERVICE_UNAVAILABLE') {
    super(503, errorCode)
    this.detailCode = 'Network request failed with status code 503 (Service Unavailable)'
  }
}

export class HttpStatusTooManyRequestsError extends HttpClientError {
  constructor(errorCode: string = 'HTTP_STATUS_TOO_MANY_REQUESTS') {
    super(429, errorCode)
    this.detailCode = 'Network request failed with status code 429 (Too Many Requests)'
  }
}

const ErrorTypeSchema = z.object({
  type: z.string(),
  message: z.string(),
})

type ErrorType = z.infer<typeof ErrorTypeSchema>

const ResponseBodySchema = z.object({
  errors: z.array(ErrorTypeSchema),
})

export class HttpStatusUnauthorizedError extends HttpClientError {
  errors: ErrorType[] = []

  constructor(responseBody?: unknown) {
    super(401, 'HTTP_STATUS_UNAUTHORIZED')
    this.detailCode = 'Network request failed with status code 401 (Unauthorized)'

    const parsed = ResponseBodySchema.safeParse(responseBody)
    if (parsed.success) {
      this.errors = parsed.data.errors
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
      return new HttpStatusBadRequestError()
    case 401:
      return new HttpStatusUnauthorizedError(responseBody)
    case 403:
      return new HttpStatusForbiddenError()
    case 404:
      return new HttpStatusNotFoundError()
    case 429:
      return new HttpStatusTooManyRequestsError()
    case 500:
      return new HttpStatusInternalServerError()
    case 503:
      return new HttpStatusServiceUnavailableError()
  }

  if (statusCode >= 400 && statusCode <= 499) {
    return new HttpClientError(statusCode)
  }

  if (statusCode >= 500 && statusCode <= 599) {
    return new HttpServerError(statusCode)
  }

  return new HttpError(statusCode)
}

export const createErrorFromErrorCode = (errorCode: string, detailCode?: string): ErrorWithCode => {
  return new ErrorWithCode(errorCode, detailCode)
}

export const mapAppErrorCodeToError = (errorCode: string, statusCode = -1): ErrorWithCode | null => {
  switch (errorCode) {
    case 'NETWORK_ERROR':
      return new NetworkError()
    case 'HTTP_ERROR':
      return new HttpError(statusCode)
    case 'HTTP_CLIENT_ERROR':
      return new HttpClientError(statusCode)
    case 'HTTP_SERVER_ERROR':
      return new HttpServerError(statusCode)
    case 'HTTP_STATUS_BAD_REQUEST':
      return new HttpStatusBadRequestError()
    case 'HTTP_STATUS_FORBIDDEN':
      return new HttpStatusForbiddenError()
    case 'HTTP_STATUS_INTERNAL_SERVER_ERROR':
      return new HttpStatusInternalServerError()
    case 'HTTP_STATUS_NOT_FOUND':
      return new HttpStatusNotFoundError()
    case 'HTTP_STATUS_SERVICE_UNAVAILABLE':
      return new HttpStatusServiceUnavailableError()
    case 'HTTP_STATUS_TOO_MANY_REQUESTS':
      return new HttpStatusTooManyRequestsError()
    case 'HTTP_STATUS_UNAUTHORIZED':
      return new HttpStatusUnauthorizedError()
    case 'UNKNOWN':
      return new UnknownError()
  }

  return null
}
