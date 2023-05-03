import { act, renderHook, waitFor } from '@testing-library/react-native'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

import { mockListenerOnce } from '../../../../services/testing/mock-listener-once'
import { SpartacusBridge } from './spartacus-bridge'
import { AuthApi, useWebViewAuthSync } from './use-webview-auth-sync'
import { mockedBridgeAdapterApi } from './__mocks__/create-bridge-adapter-api'

export const server = setupServer(
  rest.post('http://localhost/cdc/accounts.logout', (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        connectedProviders: 'site',
        UID: 'ae66fdbec00349e3b762b500e0881c23',
        logoutActiveSession: true,
        samlContext: 'idp-initiated',
        connectedSamlSessions: '',
        callId: '4d3b77fab86041819bbebbacb30ce9b4',
        errorCode: 0,
        apiVersion: 2,
        statusCode: 200,
        statusReason: 'OK',
        time: '2023-04-25T14:10:15.040Z',
      }),
    )
  }),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('useWebViewAuthSync', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('webViewAuthState.isLoggedIn', () => {
    const authApi: AuthApi = {
      login: jest.fn(),
      logout: jest.fn(),
    }
    const authApiState: Parameters<typeof useWebViewAuthSync>[2] = {
      isUserLoggedIn: false,
      isUserLoggedInToCdc: false,
      isUserLoggedInToCommerce: false,
      commerceAccessToken: undefined,
      cdc: null,
    }

    it('should be falsy initially', async () => {
      const { result } = renderHook(() => useWebViewAuthSync(mockedBridgeAdapterApi, {}, authApiState, authApi))
      await waitFor(() => expect(result.current.isLoggedIn).toBeFalsy())
    })

    it('should be set to true after receiveing AuthIsUserLoggedIn StateForwarding', async () => {
      const sendAuthIsUserLoggedIn = mockListenerOnce(mockedBridgeAdapterApi.onAuthIsUserLoggedIn)

      const { result } = renderHook(() => useWebViewAuthSync(mockedBridgeAdapterApi, {}, authApiState, authApi))
      await waitFor(() => expect(result.current).toBeDefined())
      await waitFor(() => expect(sendAuthIsUserLoggedIn.current).toBeDefined())

      await act(() => {
        sendAuthIsUserLoggedIn.current!({
          source: SpartacusBridge.StateForwarding.Source.AuthIsUserLoggedIn,
          value: true,
        })
      })

      expect(result.current.isLoggedIn).toBeTruthy()
    })
  })

  describe('authApiState is not logged in', () => {
    const authApi: AuthApi = {
      login: jest.fn(),
      logout: jest.fn(),
    }

    const authApiState: Parameters<typeof useWebViewAuthSync>[2] = {
      isUserLoggedIn: false,
      isUserLoggedInToCdc: false,
      isUserLoggedInToCommerce: false,
      commerceAccessToken: undefined,
      cdc: null,
    }

    it('should authLogout when bridge is ready', async () => {
      const sendAuthIsUserLoggedIn = mockListenerOnce(mockedBridgeAdapterApi.onAuthIsUserLoggedIn)

      renderHook(() => useWebViewAuthSync(mockedBridgeAdapterApi, { isReady: true }, authApiState, authApi))
      await waitFor(() => expect(sendAuthIsUserLoggedIn.current).toBeDefined())

      await act(() => {
        sendAuthIsUserLoggedIn.current!({
          source: SpartacusBridge.StateForwarding.Source.AuthIsUserLoggedIn,
          value: true,
        })
      })

      expect(mockedBridgeAdapterApi.authLogout).toBeCalledTimes(1)
    })

    it('should not authLogout when bridge is not ready', async () => {
      const sendAuthIsUserLoggedIn = mockListenerOnce(mockedBridgeAdapterApi.onAuthIsUserLoggedIn)

      renderHook(() => useWebViewAuthSync(mockedBridgeAdapterApi, {}, authApiState, authApi))
      await waitFor(() => expect(sendAuthIsUserLoggedIn.current).toBeDefined())

      await act(() => {
        sendAuthIsUserLoggedIn.current!({
          source: SpartacusBridge.StateForwarding.Source.AuthIsUserLoggedIn,
          value: true,
        })
      })

      expect(mockedBridgeAdapterApi.authLogout).toBeCalledTimes(0)
    })
  })

  describe('authApiState is logged in', () => {
    const testTimestamp = new Date(2032, 1, 1).getTime()
    const authApiState: Parameters<typeof useWebViewAuthSync>[2] = {
      isUserLoggedIn: true,
      isUserLoggedInToCommerce: true,
      isUserLoggedInToCdc: true,
      cdc: {
        uid: '0',
        user: { firstName: 'Max', email: 'max@test.test' },
        idToken: 'dummy',
        sessionToken: 'dummy',
        uidSignature: 'dummy',
        sessionSecret: 'dummy',
        sessionValidity: testTimestamp,
        sessionStartTimestamp: testTimestamp,
        isVerified: true,
      },
      commerceAccessToken: 'my_access_token',
    }

    it('should authLogin when bridge is ready', async () => {
      const authApi: AuthApi = {
        login: jest.fn(),
        logout: jest.fn(),
      }
      renderHook(() => useWebViewAuthSync(mockedBridgeAdapterApi, { isReady: true }, authApiState, authApi))

      await waitFor(() => expect(mockedBridgeAdapterApi.authLogin).toBeCalledTimes(1))
      expect(mockedBridgeAdapterApi.authLogin).toBeCalledWith('my_access_token')
    })

    it('should not authLogin when bridge is not ready', async () => {
      const authApi: AuthApi = {
        login: jest.fn(),
        logout: jest.fn(),
      }
      renderHook(() => useWebViewAuthSync(mockedBridgeAdapterApi, {}, authApiState, authApi))

      await waitFor(() => expect(mockedBridgeAdapterApi.authLogin).toBeCalledTimes(0))
    })

    it('Should force logout if isLoggedIn changes to false within 5 seconds', async () => {
      const authApi: AuthApi = {
        login: jest.fn(),
        logout: jest.fn(),
      }

      const sendAuthIsUserLoggedIn = mockListenerOnce(mockedBridgeAdapterApi.onAuthIsUserLoggedIn)

      renderHook(() => {
        return useWebViewAuthSync(mockedBridgeAdapterApi, { isReady: true }, authApiState, authApi)
      })
      await waitFor(() => expect(sendAuthIsUserLoggedIn.current).toBeDefined())

      sendAuthIsUserLoggedIn.current!({
        source: SpartacusBridge.StateForwarding.Source.AuthIsUserLoggedIn,
        value: true,
      })
      sendAuthIsUserLoggedIn.current!({
        source: SpartacusBridge.StateForwarding.Source.AuthIsUserLoggedIn,
        value: false,
      })

      await waitFor(() => expect(authApi.logout).toHaveBeenCalledTimes(1))
    })
  })
})
