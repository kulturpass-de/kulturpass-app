import { act, renderHook } from '@testing-library/react-native'

import { mockListenerOnce } from '../../../../services/testing/mock-listener-once'
import { SpartacusBridge } from './spartacus-bridge'
import { useWebViewAuthSync } from './use-webview-auth-sync'
import { mockedBridgeAdapterApi } from './__mocks__/create-bridge-adapter-api'

describe('useWebViewAuthSync', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('webViewAuthState.isLoggedIn', () => {
    const authApiState: Parameters<typeof useWebViewAuthSync>[2] = {
      isUserLoggedIn: false,
      commerceAccessToken: undefined,
    }

    it('should be falsy initially', () => {
      const { result } = renderHook(() => useWebViewAuthSync(mockedBridgeAdapterApi, {}, authApiState))

      expect(result.current.isLoggedIn).toBeFalsy()
    })

    it('should be set to true after receiveing AuthIsUserLoggedIn StateForwarding', () => {
      const sendAuthIsUserLoggedIn = mockListenerOnce(mockedBridgeAdapterApi.onAuthIsUserLoggedIn)

      const { result } = renderHook(() => useWebViewAuthSync(mockedBridgeAdapterApi, {}, authApiState))

      act(() => {
        sendAuthIsUserLoggedIn.current?.({
          source: SpartacusBridge.StateForwarding.Source.AuthIsUserLoggedIn,
          value: true,
        })
      })

      expect(result.current.isLoggedIn).toBe(true)
    })
  })

  describe('authApiState is not logged in', () => {
    const authApiState: Parameters<typeof useWebViewAuthSync>[2] = {
      isUserLoggedIn: false,
      commerceAccessToken: undefined,
    }

    it('should authLogout when bridge is ready', () => {
      const sendAuthIsUserLoggedIn = mockListenerOnce(mockedBridgeAdapterApi.onAuthIsUserLoggedIn)

      renderHook(() => useWebViewAuthSync(mockedBridgeAdapterApi, { isReady: true }, authApiState))

      act(() => {
        sendAuthIsUserLoggedIn.current?.({
          source: SpartacusBridge.StateForwarding.Source.AuthIsUserLoggedIn,
          value: true,
        })
      })

      expect(mockedBridgeAdapterApi.authLogout).toBeCalledTimes(1)
    })

    it('should not authLogout when bridge is not ready', () => {
      const sendAuthIsUserLoggedIn = mockListenerOnce(mockedBridgeAdapterApi.onAuthIsUserLoggedIn)

      renderHook(() => useWebViewAuthSync(mockedBridgeAdapterApi, {}, authApiState))

      act(() => {
        sendAuthIsUserLoggedIn.current?.({
          source: SpartacusBridge.StateForwarding.Source.AuthIsUserLoggedIn,
          value: true,
        })
      })

      expect(mockedBridgeAdapterApi.authLogout).toBeCalledTimes(0)
    })
  })

  describe('authApiState is logged in', () => {
    const authApiState: Parameters<typeof useWebViewAuthSync>[2] = {
      isUserLoggedIn: true,
      commerceAccessToken: 'my_access_token',
    }

    it('should authLogin when bridge is ready', () => {
      renderHook(() => useWebViewAuthSync(mockedBridgeAdapterApi, { isReady: true }, authApiState))

      expect(mockedBridgeAdapterApi.authLogin).toBeCalledTimes(1)
      expect(mockedBridgeAdapterApi.authLogin).toBeCalledWith('my_access_token')
    })

    it('should not authLogin when bridge is not ready', () => {
      renderHook(() => useWebViewAuthSync(mockedBridgeAdapterApi, {}, authApiState))

      expect(mockedBridgeAdapterApi.authLogin).toBeCalledTimes(0)
    })
  })
})
