import {
  CdcApiErrorResponseBody,
  CdcError,
  CdcResponseErrorSchema,
  CdcStatusValidationError,
  createCdcErrorFromSchema,
  mapCdcErrorCodeToAppErrorCode,
} from './cdc-errors'

test('Should map cdc error code to app error codes', () => {
  expect(mapCdcErrorCodeToAppErrorCode(400009)).toBe('CDC_STATUS_VALIDATION_ERROR')
  expect(mapCdcErrorCodeToAppErrorCode(400028)).toBe('CDC_EMAIL_NOT_VERIFIED')
  expect(mapCdcErrorCodeToAppErrorCode(403041)).toBe('CDC_ACCOUNT_DISABLED')
  expect(mapCdcErrorCodeToAppErrorCode(403042)).toBe('CDC_INVALID_LOGINID')
  expect(mapCdcErrorCodeToAppErrorCode(400)).toBe('CDC_STATUS_BAD_REQUEST')
  expect(mapCdcErrorCodeToAppErrorCode(400123)).toBe('CDC_STATUS_BAD_REQUEST')
  expect(mapCdcErrorCodeToAppErrorCode(401)).toBe('CDC_STATUS_UNAUTHORIZED')
  expect(mapCdcErrorCodeToAppErrorCode(401123)).toBe('CDC_STATUS_UNAUTHORIZED')
  expect(mapCdcErrorCodeToAppErrorCode(403)).toBe('CDC_STATUS_FORBIDDEN')
  expect(mapCdcErrorCodeToAppErrorCode(403123)).toBe('CDC_STATUS_FORBIDDEN')
  expect(mapCdcErrorCodeToAppErrorCode(404)).toBe('CDC_STATUS_NOT_FOUND')
  expect(mapCdcErrorCodeToAppErrorCode(404123)).toBe('CDC_STATUS_NOT_FOUND')
  expect(mapCdcErrorCodeToAppErrorCode(406)).toBe('CDC_CLIENT_ERROR')
  expect(mapCdcErrorCodeToAppErrorCode(500)).toBe('CDC_SERVER_ERROR')
  expect(mapCdcErrorCodeToAppErrorCode(505)).toBe('CDC_SERVER_ERROR')
  expect(mapCdcErrorCodeToAppErrorCode(300)).toBe('CDC_ERROR')
})

test('Should create a CdcError from api response body', () => {
  const responseBody: CdcApiErrorResponseBody = {
    callId: 'b3585ea186d34a9e84570f5691f93ba8',
    errorCode: 400009,
    errorDetails: 'Validation failed',
    errorMessage: 'Validation error',
    apiVersion: 2,
    statusCode: 400,
    statusReason: 'Bad Request',
    time: '2023-02-17T07:19:52.160Z',
    validationErrors: [
      {
        errorCode: 400003,
        message: 'email already exists',
        fieldName: 'email',
      },
    ],
  }

  const error = createCdcErrorFromSchema(responseBody)

  expect(() => {
    throw error
  }).toThrowError(CdcError)

  expect(() => {
    throw error
  }).toThrowError(CdcStatusValidationError)

  expect(error instanceof CdcStatusValidationError).toBeTruthy()
  if (error instanceof CdcStatusValidationError) {
    expect(error.validationErrors).toHaveLength(1)
  }
})

test('Should valid register response', () => {
  const responseJson = {
    callId: '6872ec8551f34f6dacdd27c3eb96f2af',
    errorCode: 206002,
    errorDetails: 'Account Pending Verification',
    errorMessage: 'Account Pending Verification',
    apiVersion: 2,
    statusCode: 206,
    statusReason: 'Partial Content',
    time: '2023-02-21T13:06:30.973Z',
    ignoredParams: [
      {
        paramName: 'data[dateOfBirth]',
        warningCode: 403007,
        message:
          'This parameter was not recognized as valid for this API method with your security credentials nor was it recognized as a standard Gigya control parameter.',
      },
    ],
    registeredTimestamp: 1676984790,
    UID: 'a9e1ab816eca4575aea7993502a05259',
    UIDSignature: 'otr/lJ/fcBV+5qumLWDhWV2g9JM=',
    signatureTimestamp: 1676984790,
    created: '2023-02-21T13:06:30.649Z',
    createdTimestamp: 1676984790,
    data: {},
    emails: {
      verified: [],
      unverified: ['user@example.org'],
    },
    isActive: true,
    isRegistered: true,
    isVerified: false,
    lastUpdated: '2023-02-21T13:06:30.936Z',
    lastUpdatedTimestamp: 1676984790936,
    oldestDataUpdated: '2023-02-21T13:06:30.649Z',
    oldestDataUpdatedTimestamp: 1676984790649,
    profile: {
      email: 'user@example.org',
    },
    registered: '2023-02-21T13:06:30.936Z',
    socialProviders: 'site',
    id_token:
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJFUTBNVVE1TjBOQ1JUSkVNemszTTBVMVJrTkRRMFUwUTBNMVJFRkJSamhETWpkRU5VRkJRZyIsImRjIjoiZXUxIn0.eyJpc3MiOiJodHRwczovL2ZpZG0uZ2lneWEuY29tL2p3dC80X2pFMkliNG82dGVhZDdFNFlBdDRzTlEvIiwic3ViIjoiYTllMWFiODE2ZWNhNDU3NWFlYTc5OTM1MDJhMDUyNTkiLCJpYXQiOjE2NzY5ODQ3OTAsImV4cCI6MTY3Njk4NDg1MCwiaXNMb2dnZWRJbiI6ZmFsc2V9.V_fO6055_0Uq81DK4qW3-u12yZbtKpTlmxMtK1q5sashb1qkqmjH-M2xzmXIj0Eepj7N9bgk2EMwgEwpmt4meFw95OyWHTKulJuW1r7XTNRj87plXH-_z--MnZqdi5iSssT2VEi2oIKb3WSh0zQED-WCHA60nabqxMzc5NCI-TPO6saWcz_x490fYaHCWIQa7vAjfUjyZUK1vrmQ8YvZvbCKAhymtO8imIzgNJMp2AOucCzy9ktQRK_qW-I3Igku1oW0yhl5Nx7zlQB34TzsgaZYAGKFsBys2KSi0emljwjXpcFTdBL2uSetWrNEtQNir7LcLXBvLMSnp0DgYdz4sQ',
    newUser: true,
    regToken:
      'st2.s.AcbH82NtIQ.9B0egmNL-xIuzJEGfWfXh5pG0mdSep21RWGB1_62LMTmpGv-wEV5qLF2IT7vypS7pYYNKHT9rDhbYUqzr0CPVbjdIUd9gWsa2KIwtxhDRyA.lackNk8ajRLE81Cr7nscf40Wyjl7Aq8qTmdJ0yawXXkV8szz1geoSeVcMebjmwO8N-8sn6Wj2goPknqty5bZEA.sc3',
  }

  const errorResult = CdcResponseErrorSchema.safeParse(responseJson)
  expect(errorResult.success).toBeFalsy()
})
