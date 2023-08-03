import { renderHook } from '@testing-library/react-native'
import { RootState } from '../../../../services/redux/configure-store'
import { configureMockStore } from '../../../../services/testing/configure-mock-store'
import { mockedBridgeAdapterApi } from './__mocks__/create-bridge-adapter-api'
import { WebViewId } from './types'
import { useWebViewLocationSync } from './use-webview-location-sync'

type GeolocationType = Parameters<typeof useWebViewLocationSync>[2]

describe('useWebViewLocationSync', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  const undefinedUserLocationState: Parameters<typeof useWebViewLocationSync>[2] = undefined
  const definedUserLocationState = { coords: { latitude: 5, longitude: 10 } } as GeolocationType
  const changedUserLocationState = { coords: { latitude: 5.00005, longitude: 10.00005 } } as GeolocationType
  const notChangedUserLocationState = { coords: { latitude: 5.000005, longitude: 10.000005 } } as GeolocationType

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

  it('should call geolocationSetLocation only once for the same location', () => {
    const store = configureMockStore({
      preloadedState: { webviews: { [WebViewId.Home]: { isReady: true } } } as RootState,
    })

    const hookResult = renderHook(
      (locationState: typeof definedUserLocationState) =>
        useWebViewLocationSync(WebViewId.Home, mockedBridgeAdapterApi, locationState),
      {
        wrapper: store.wrapper,
        initialProps: definedUserLocationState,
      },
    )

    hookResult.rerender(notChangedUserLocationState)

    hookResult.unmount()

    expect(mockedBridgeAdapterApi.geolocationSetLocation).toBeCalledTimes(1)
    expect(mockedBridgeAdapterApi.geolocationSetLocation).toBeCalledWith(
      definedUserLocationState?.coords.latitude,
      definedUserLocationState?.coords.longitude,
    )
  })

  it('should call geolocationSetLocation only once for the same, undefined location', () => {
    const store = configureMockStore({
      preloadedState: { webviews: { [WebViewId.Home]: { isReady: true } } } as RootState,
    })

    const hookResult = renderHook(
      (locationState: typeof definedUserLocationState) =>
        useWebViewLocationSync(WebViewId.Home, mockedBridgeAdapterApi, locationState),
      {
        wrapper: store.wrapper,
        initialProps: undefined,
      },
    )

    hookResult.rerender(undefined)

    hookResult.unmount()

    expect(mockedBridgeAdapterApi.geolocationSetLocation).toBeCalledTimes(1)
    expect(mockedBridgeAdapterApi.geolocationSetLocation).toBeCalledWith()
  })

  it('should call geolocationSetLocation if the location has changed too much', () => {
    const store = configureMockStore({
      preloadedState: { webviews: { [WebViewId.Home]: { isReady: true } } } as RootState,
    })

    const hookResult = renderHook(
      (locationState: typeof definedUserLocationState) =>
        useWebViewLocationSync(WebViewId.Home, mockedBridgeAdapterApi, locationState),
      {
        wrapper: store.wrapper,
        initialProps: definedUserLocationState,
      },
    )

    expect(mockedBridgeAdapterApi.geolocationSetLocation).toBeCalledTimes(1)
    expect(mockedBridgeAdapterApi.geolocationSetLocation.mock.calls[0]).toEqual([
      definedUserLocationState?.coords.latitude,
      definedUserLocationState?.coords.longitude,
    ])

    hookResult.rerender(changedUserLocationState)

    hookResult.unmount()

    expect(mockedBridgeAdapterApi.geolocationSetLocation).toBeCalledTimes(2)
    expect(mockedBridgeAdapterApi.geolocationSetLocation.mock.calls[1]).toEqual([
      changedUserLocationState?.coords.latitude,
      changedUserLocationState?.coords.longitude,
    ])
  })
})
