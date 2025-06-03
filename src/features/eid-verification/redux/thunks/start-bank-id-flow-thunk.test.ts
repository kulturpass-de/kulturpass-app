import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { Platform } from 'react-native'
import * as InAppBrowser from 'react-native-inappbrowser-reborn'
import { cdcApi } from '../../../../services/api/cdc-api'
import { UnknownError } from '../../../../services/errors/errors'
import { RootState } from '../../../../services/redux/configure-store'
import { configureMockStore } from '../../../../services/testing/configure-mock-store'
import { AA2AuthError, AA2BelowMinYearOfBirth } from '../../errors'
import { startBankIdFlow } from './start-bank-id-flow-thunk'

jest.useFakeTimers()

describe('startBankIdFlow', () => {
  const id_token = 'test-id-token'

  const server = setupServer()

  const mockServer = (status = 200) => {
    server.use(http.post('*/accounts.getAccountInfo', () => HttpResponse.json({ id_token }, { status })))
  }

  const preloadedState = {
    auth: {
      cdc: {
        idToken: 'my_id_token',
        sessionToken: 'my_session_token',
        sessionSecret: 'my_session_secret',
        sessionValidity: -2,
      },
      commerce: {
        access_token: 'my_access_token',
      },
    },
  } as RootState

  beforeAll(() => server.listen())
  afterEach(() => {
    jest.resetAllMocks()
    server.resetHandlers()
  })
  afterAll(() => server.close())

  test('should successfully do a bank id flow on android', async () => {
    mockServer()

    const store = configureMockStore({
      middlewares: [cdcApi.middleware],
      preloadedState,
    })

    const mockIsAvailable = jest.spyOn(InAppBrowser.default, 'isAvailable')
    mockIsAvailable.mockResolvedValue(true)

    const mockOpenAuth = jest.spyOn(InAppBrowser.default, 'openAuth')
    mockOpenAuth.mockResolvedValue({
      type: 'success',
      url: 'kulturpass://example.com?popup=IDENTITY_VERIFICATION_COMPLETION',
    })

    Platform.OS = 'android'
    const result = await store.dispatch(startBankIdFlow('123456')).unwrap()
    expect(result).toBe(true)
    const authCall = mockOpenAuth.mock.calls[0]
    expect(authCall[0]).toBe('http://localhost/bankId/login?agent=app&blz=123456&idToken=test-id-token')
    expect(authCall[1]).toBe('kulturpass://localhost')
  })

  test('should successfully do a bank id flow on iOS', async () => {
    mockServer()

    const store = configureMockStore({
      middlewares: [cdcApi.middleware],
      preloadedState,
    })

    const mockIsAvailable = jest.spyOn(InAppBrowser.default, 'isAvailable')
    mockIsAvailable.mockResolvedValue(true)

    const mockOpenAuth = jest.spyOn(InAppBrowser.default, 'openAuth')
    mockOpenAuth.mockResolvedValue({
      type: 'success',
      url: 'kulturpass://example.com?popup=IDENTITY_VERIFICATION_COMPLETION',
    })

    Platform.OS = 'ios'
    const result = await store.dispatch(startBankIdFlow('123456')).unwrap()
    expect(result).toBe(true)
    const authCall = mockOpenAuth.mock.calls[0]
    expect(authCall[0]).toBe('http://localhost/bankId/login?agent=app&blz=123456&idToken=test-id-token')
    expect(authCall[1]).toBe('kulturpass://')
  })

  test('should fail with error code if auth was unsuccessful', async () => {
    mockServer()

    const store = configureMockStore({
      middlewares: [cdcApi.middleware],
      preloadedState,
    })

    const mockIsAvailable = jest.spyOn(InAppBrowser.default, 'isAvailable')
    mockIsAvailable.mockResolvedValue(true)

    const mockOpenAuth = jest.spyOn(InAppBrowser.default, 'openAuth')
    mockOpenAuth.mockResolvedValueOnce({
      type: 'success',
      url: 'kulturpass://example.com?popup=IDENTITY_VERIFICATION_ERROR&errorCode=TEST_ERROR',
    })

    Platform.OS = 'ios'
    await expect(store.dispatch(startBankIdFlow('123456')).unwrap()).rejects.toBeInstanceOf(AA2AuthError)

    mockOpenAuth.mockResolvedValueOnce({
      type: 'success',
      url: 'kulturpass://example.com?popup=IDENTITY_VERIFICATION_ERROR&errorCode=BELOW_MIN_YEAR_OF_BIRTH',
    })
    await expect(store.dispatch(startBankIdFlow('123456')).unwrap()).rejects.toBeInstanceOf(AA2BelowMinYearOfBirth)
  })

  test('should fail with error code if iap is unavailable', async () => {
    mockServer()

    const store = configureMockStore({
      middlewares: [cdcApi.middleware],
      preloadedState,
    })

    const mockIsAvailable = jest.spyOn(InAppBrowser.default, 'isAvailable')
    mockIsAvailable.mockResolvedValue(false)

    Platform.OS = 'ios'
    await expect(store.dispatch(startBankIdFlow('123456')).unwrap()).rejects.toBeInstanceOf(UnknownError)
  })

  test('should return false if the user cancelled the bankid flow', async () => {
    mockServer()

    const store = configureMockStore({
      middlewares: [cdcApi.middleware],
      preloadedState,
    })

    const mockIsAvailable = jest.spyOn(InAppBrowser.default, 'isAvailable')
    mockIsAvailable.mockResolvedValue(true)

    const mockOpenAuth = jest.spyOn(InAppBrowser.default, 'openAuth')
    mockOpenAuth.mockResolvedValue({
      type: 'cancel',
    })

    Platform.OS = 'android'
    const result = await store.dispatch(startBankIdFlow('123456')).unwrap()
    expect(result).toBe(false)
    const authCall = mockOpenAuth.mock.calls[0]
    expect(authCall[0]).toBe('http://localhost/bankId/login?agent=app&blz=123456&idToken=test-id-token')
    expect(authCall[1]).toBe('kulturpass://localhost')
  })
})
