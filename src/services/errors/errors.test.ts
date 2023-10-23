import {
  createErrorFromErrorCode,
  createHttpErrorFromStatusCode,
  ErrorWithCode,
  HttpClientError,
  HttpError,
  HttpServerError,
  HttpStatusBadRequestError,
} from './errors'

test('Should create HttpStatusBadRequestError', () => {
  const httpError = createHttpErrorFromStatusCode(400)
  expect(httpError instanceof HttpStatusBadRequestError).toBeTruthy()
  expect(httpError instanceof HttpClientError).toBeTruthy()
  expect(httpError instanceof HttpError).toBeTruthy()
  expect(httpError.statusCode).toBe(400)
  expect(httpError.errorCode).toBe('HTTP_STATUS_BAD_REQUEST')
})

test('Should create HttpClientError', () => {
  const httpError = createHttpErrorFromStatusCode(408)
  expect(httpError instanceof HttpClientError).toBeTruthy()
  expect(httpError instanceof HttpError).toBeTruthy()
  expect(httpError.statusCode).toBe(408)
  expect(httpError.errorCode).toBe('HTTP_CLIENT_ERROR')
})

test('Should create HttpError', () => {
  const httpError = createHttpErrorFromStatusCode(302)
  expect(httpError instanceof HttpClientError).toBeFalsy()
  expect(httpError instanceof HttpServerError).toBeFalsy()
  expect(httpError instanceof HttpError).toBeTruthy()
  expect(httpError.statusCode).toBe(302)
  expect(httpError.errorCode).toBe('HTTP_ERROR')
})

test('Should throw HttpError', () => {
  expect(() => {
    throw createHttpErrorFromStatusCode(400)
  }).toThrowError(HttpError)
})

test('Should create error from errorCode', () => {
  const error = createErrorFromErrorCode('NOT_SURE', 'This is an unusual exception.')
  expect(error.errorCode).toBe('NOT_SURE')
  expect(error.detailCode).toBe('This is an unusual exception.')
  expect(error instanceof ErrorWithCode).toBeTruthy()
  expect(error.message).toBe('Unknown error with error code "NOT_SURE".')
})

test('Should throw an error of ErrorWithCode', () => {
  expect(() => {
    throw createErrorFromErrorCode('HELLO', 'Not great to see you!')
  }).toThrowError(ErrorWithCode)
})
