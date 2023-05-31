import { act, renderHook } from '@testing-library/react-native'

import { mockListenerOnce } from '../../../../services/testing/mock-listener-once'
import { SpartacusBridge } from './spartacus-bridge'
import { useWebViewLocationSync } from './use-webview-location-sync'
import { mockedBridgeAdapterApi } from './__mocks__/create-bridge-adapter-api'

describe('useWebViewLocationSync', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('userLocationState is undefined', () => {
    const userLocationState: Parameters<typeof useWebViewLocationSync>[2] = undefined

    it('should geolocationSetLocation when bridge is ready', () => {
      const sendAuthIsUserLoggedIn = mockListenerOnce(mockedBridgeAdapterApi.onAuthIsUserLoggedIn)

      renderHook(() => useWebViewLocationSync(mockedBridgeAdapterApi, { isReady: true }, userLocationState))

      act(() => {
        sendAuthIsUserLoggedIn.current?.({
          source: SpartacusBridge.StateForwarding.Source.AuthIsUserLoggedIn,
          value: true,
        })
      })

      expect(mockedBridgeAdapterApi.geolocationSetLocation).toBeCalledTimes(1)
    })

    it('should not geolocationSetLocation when bridge is not ready', () => {
      const sendAuthIsUserLoggedIn = mockListenerOnce(mockedBridgeAdapterApi.onAuthIsUserLoggedIn)

      renderHook(() => useWebViewLocationSync(mockedBridgeAdapterApi, {}, userLocationState))

      act(() => {
        sendAuthIsUserLoggedIn.current?.({
          source: SpartacusBridge.StateForwarding.Source.AuthIsUserLoggedIn,
          value: true,
        })
      })

      expect(mockedBridgeAdapterApi.geolocationSetLocation).toBeCalledTimes(0)
    })
  })

  describe('userLocationState is defined', () => {
    const userLocationState = {
      coords: { latitude: 5, longitude: 10 },
    } as Parameters<typeof useWebViewLocationSync>[2]

    it('should geolocationSetLocation when bridge is ready', () => {
      renderHook(() => useWebViewLocationSync(mockedBridgeAdapterApi, { isReady: true }, userLocationState))

      expect(mockedBridgeAdapterApi.geolocationSetLocation).toBeCalledTimes(1)
      expect(mockedBridgeAdapterApi.geolocationSetLocation).toBeCalledWith(
        userLocationState?.coords.latitude,
        userLocationState?.coords.longitude,
      )
    })

    it('should not geolocationSetLocation when bridge is not ready', () => {
      renderHook(() => useWebViewLocationSync(mockedBridgeAdapterApi, {}, userLocationState))

      expect(mockedBridgeAdapterApi.geolocationSetLocation).toBeCalledTimes(0)
    })
  })
})
