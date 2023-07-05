import { renderHook } from '@testing-library/react-native'
import { RootState } from '../../../../services/redux/configure-store'
import { configureMockStore } from '../../../../services/testing/configure-mock-store'
import { mockedBridgeAdapterApi } from './__mocks__/create-bridge-adapter-api'
import { WebViewId } from './types'
import { useWebViewLocationSync } from './use-webview-location-sync'

describe('useWebViewLocationSync', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  const undefinedUserLocationState: Parameters<typeof useWebViewLocationSync>[2] = undefined
  const definedUserLocationState = { coords: { latitude: 5, longitude: 10 } } as Parameters<
    typeof useWebViewLocationSync
  >[2]

  it('should not geolocationSetLocation when bridge is not ready', () => {
    const store = configureMockStore({
      preloadedState: { webviews: { [WebViewId.Home]: { isReady: false } } } as RootState,
    })

    renderHook(() => useWebViewLocationSync(WebViewId.Home, mockedBridgeAdapterApi, undefinedUserLocationState), {
      wrapper: store.wrapper,
    }).unmount()

    expect(mockedBridgeAdapterApi.geolocationSetLocation).toBeCalledTimes(0)

    renderHook(() => useWebViewLocationSync(WebViewId.Home, mockedBridgeAdapterApi, definedUserLocationState), {
      wrapper: store.wrapper,
    }).unmount()

    expect(mockedBridgeAdapterApi.geolocationSetLocation).toBeCalledTimes(0)
  })

  it('should geolocationSetLocation when bridge is ready', () => {
    const store = configureMockStore({
      preloadedState: { webviews: { [WebViewId.Home]: { isReady: true } } } as RootState,
    })

    renderHook(() => useWebViewLocationSync(WebViewId.Home, mockedBridgeAdapterApi, undefinedUserLocationState), {
      wrapper: store.wrapper,
    }).unmount()

    expect(mockedBridgeAdapterApi.geolocationSetLocation).toBeCalledTimes(1)
    expect(mockedBridgeAdapterApi.geolocationSetLocation).toBeCalledWith()

    renderHook(() => useWebViewLocationSync(WebViewId.Home, mockedBridgeAdapterApi, definedUserLocationState), {
      wrapper: store.wrapper,
    }).unmount()

    expect(mockedBridgeAdapterApi.geolocationSetLocation).toBeCalledTimes(2)
    expect(mockedBridgeAdapterApi.geolocationSetLocation).toBeCalledWith(
      definedUserLocationState?.coords.latitude,
      definedUserLocationState?.coords.longitude,
    )
  })
})
