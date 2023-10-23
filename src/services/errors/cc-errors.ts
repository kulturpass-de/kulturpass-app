import { ErrorWithCode } from './errors'

export class CcError extends ErrorWithCode {
  constructor(errorCode: string = 'CC_ERROR') {
    super(errorCode)
    this.detailCode = 'Commerce network request failed with unknown error.'
  }
}

export class CcOAuthError extends CcError {
  constructor(errorCode: string = 'CC_OAUTH_ERROR') {
    super(errorCode)
    this.detailCode = 'Commerce OAuth token network request failed with unknown error.'
  }
}

export class CcOAuthInvalidJsonError extends CcOAuthError {
  constructor(errorCode: string = 'CC_OAUTH_INVALID_JSON') {
    super(errorCode)
    this.detailCode = 'The Commerce OAuth token request returned an invalid JSON response.'
  }
}

export class CcOAuthClientError extends CcOAuthError {
  statusCode: number

  constructor(statusCode: number, errorCode: string = 'CC_OAUTH_CLIENT_ERROR') {
    super(errorCode)
    this.statusCode = statusCode
    this.detailCode = 'Commerce OAuth token request failed with an unspecified client error (status code 400 - 499)'
  }
}

export class CcOAuthStatusForbiddenError extends CcOAuthClientError {
  constructor(errorCode: string = 'CC_OAUTH_STATUS_FORBIDDEN') {
    super(403, errorCode)
    this.detailCode = 'Network request failed with status code 403 (Forbidden)'
  }
}

export class CcOAuthStatusUnauthorizedError extends CcOAuthClientError {
  constructor(errorCode: string = 'CC_OAUTH_STATUS_UNAUTHORIZED') {
    super(401, errorCode)
    this.detailCode = 'Network request failed with status code 401 (Unauthorized)'
  }
}

export class CcOAuthServerError extends CcOAuthError {
  statusCode: number

  constructor(statusCode: number, errorCode: string = 'CC_OAUTH_SERVER_ERROR') {
    super(errorCode)
    this.statusCode = statusCode
    this.detailCode = 'Commerce OAuth token request failed with an unspecified server error (status code 500 - 599)'
  }
}

export const createCcErrorFromStatusCode = (statusCode: number): CcError => {
  switch (statusCode) {
    case 401:
      return new CcOAuthStatusUnauthorizedError()
    case 403:
      return new CcOAuthStatusForbiddenError()
  }

  if (statusCode >= 400 && statusCode <= 499) {
    return new CcOAuthClientError(statusCode)
  }

  if (statusCode >= 500 && statusCode <= 599) {
    return new CcOAuthServerError(statusCode)
  }

  return new CcError()
}

export const mapCcErrorCodeToError = (errorCode: string): CcError | null => {
  switch (errorCode) {
    case 'CC_ERROR':
      return new CcError()
    case 'CC_OAUTH_ERROR':
      return new CcOAuthError()
    case 'CC_OAUTH_INVALID_JSON':
      return new CcOAuthInvalidJsonError()
    case 'CC_OAUTH_CLIENT_ERROR':
      return new CcOAuthClientError(-1)
    case 'CC_OAUTH_STATUS_FORBIDDEN':
      return new CcOAuthStatusForbiddenError()
    case 'CC_OAUTH_STATUS_UNAUTHORIZED':
      return new CcOAuthStatusUnauthorizedError()
    case 'CC_OAUTH_SERVER_ERROR':
      return new CcOAuthServerError(-1)
  }
  return null
}
