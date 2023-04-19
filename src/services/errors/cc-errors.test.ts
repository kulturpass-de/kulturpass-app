import {
  CcOAuthClientError,
  CcOAuthServerError,
  CcOAuthStatusForbiddenError,
  CcOAuthStatusUnauthorizedError,
  createCcErrorFromStatusCode,
} from './cc-errors'

test('Should throw CC_OAUTH_STATUS_UNAUTHORIZED', () => {
  expect(() => {
    throw createCcErrorFromStatusCode(401)
  }).toThrowError(CcOAuthStatusUnauthorizedError)
})

test('Should throw CC_OAUTH_STATUS_FORBIDDEN', () => {
  expect(() => {
    throw createCcErrorFromStatusCode(403)
  }).toThrowError(CcOAuthStatusForbiddenError)
})

test('Should throw CC_OAUTH_CLIENT_ERROR', () => {
  expect(() => {
    throw createCcErrorFromStatusCode(400)
  }).toThrowError(CcOAuthClientError)
})

test('Should throw CC_OAUTH_SERVER_ERROR', () => {
  expect(() => {
    throw createCcErrorFromStatusCode(500)
  }).toThrowError(CcOAuthServerError)
})
