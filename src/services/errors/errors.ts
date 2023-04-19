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

export class HttpStatusUnauthorizedError extends HttpClientError {
  constructor(errorCode: string = 'HTTP_STATUS_UNAUTHORIZED') {
    super(401, errorCode)
    this.detailCode = 'Network request failed with status code 401 (Unauthorized)'
  }
}

export class UnknownError extends ErrorWithCode {
  constructor(errorCode: string = 'UNKNOWN') {
    super(errorCode)
    this.detailCode = 'An unknown error occurred.'
  }
}

export const createHttpErrorFromStatusCode = (statusCode: number): HttpError => {
  switch (statusCode) {
    case 400:
      return new HttpStatusBadRequestError()
    case 401:
      return new HttpStatusUnauthorizedError()
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
