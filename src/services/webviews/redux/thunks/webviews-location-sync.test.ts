import { SpartacusBridge } from '../../../../features/spartacus-webview/services/webview-bridge-adapter/spartacus-bridge'
import { WebViewId } from '../../../../features/spartacus-webview/services/webview-bridge-adapter/types'
import { webViewBridgeAdapter } from '../../../../features/spartacus-webview/services/webview-bridge-adapter/webview-bridge-adapter'
import { RootState } from '../../../../services/redux/configure-store'
import { configureMockStore } from '../../../../services/testing/configure-mock-store'
import { getCurrentUserLocation } from '../../../location/redux/location-selectors'
import { setCurrentUserLocation } from '../../../location/redux/location-slice'
import { webviewsLocationSync } from './webviews-location-sync'

type GeolocationType = ReturnType<typeof getCurrentUserLocation>

jest.mock('../../../../features/spartacus-webview/services/webview-bridge-adapter/webview-bridge-adapter', () => ({
  webViewBridgeAdapter: {
    callBridgeFunction: jest.fn(),
  },
}))

describe('webviewsLocationSync', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  const undefinedUserLocationState = undefined
  const definedUserLocationState = { coords: { latitude: 5, longitude: 10 } } as GeolocationType
  const changedUserLocationState = { coords: { latitude: 5.00005, longitude: 10.00005 } } as GeolocationType
  const notChangedUserLocationState = { coords: { latitude: 5.000005, longitude: 10.000005 } } as GeolocationType

  it('should not set webview user location when bridge is not ready', async () => {
    const store = configureMockStore({
      preloadedState: {
        webviews: { [WebViewId.Home]: { isReady: false, previousSubmittedUserLocationState: null } },
        persisted: { location: { currentUserLocation: undefinedUserLocationState } },
      } as RootState,
    })

    await store.dispatch(webviewsLocationSync(WebViewId.Home))

    expect(webViewBridgeAdapter.callBridgeFunction).toHaveBeenCalledTimes(0)

    store.dispatch(setCurrentUserLocation(definedUserLocationState))

    expect(webViewBridgeAdapter.callBridgeFunction).toHaveBeenCalledTimes(0)
  })

  it('should set webview user location when bridge is ready', async () => {
    const store = configureMockStore({
      preloadedState: {
        webviews: { [WebViewId.Home]: { isReady: true, previousSubmittedUserLocationState: null } },
        persisted: { location: { currentUserLocation: undefinedUserLocationState } },
      } as RootState,
    })

    await store.dispatch(webviewsLocationSync(WebViewId.Home))

    expect(webViewBridgeAdapter.callBridgeFunction).toHaveBeenCalledTimes(1)
    expect(webViewBridgeAdapter.callBridgeFunction).toHaveBeenCalledWith(
      WebViewId.Home,
      SpartacusBridge.FunctionCall.Target.GeolocationSetLocation,
      [undefined, undefined],
    )

    store.dispatch(setCurrentUserLocation(definedUserLocationState))

    await store.dispatch(webviewsLocationSync(WebViewId.Home))

    expect(webViewBridgeAdapter.callBridgeFunction).toHaveBeenCalledTimes(2)
    expect(webViewBridgeAdapter.callBridgeFunction).toHaveBeenCalledWith(
      WebViewId.Home,
      SpartacusBridge.FunctionCall.Target.GeolocationSetLocation,
      [definedUserLocationState?.coords.latitude, definedUserLocationState?.coords.longitude],
    )
  })

  it('should set webview user location only once for the same location', async () => {
    const store = configureMockStore({
      preloadedState: {
        webviews: { [WebViewId.Home]: { isReady: true, previousSubmittedUserLocationState: null } },
        persisted: { location: { currentUserLocation: definedUserLocationState } },
      } as RootState,
    })

    await store.dispatch(webviewsLocationSync(WebViewId.Home))
    store.dispatch(setCurrentUserLocation(notChangedUserLocationState))
    await store.dispatch(webviewsLocationSync(WebViewId.Home))

    expect(webViewBridgeAdapter.callBridgeFunction).toHaveBeenCalledTimes(1)
    expect(webViewBridgeAdapter.callBridgeFunction).toHaveBeenCalledWith(
      WebViewId.Home,
      SpartacusBridge.FunctionCall.Target.GeolocationSetLocation,
      [definedUserLocationState?.coords.latitude, definedUserLocationState?.coords.longitude],
    )
  })

  it('should set webview user location only once for the same, undefined location', async () => {
    const store = configureMockStore({
      preloadedState: {
        webviews: { [WebViewId.Home]: { isReady: true, previousSubmittedUserLocationState: null } },
        persisted: { location: { currentUserLocation: undefinedUserLocationState } },
      } as RootState,
    })

    await store.dispatch(webviewsLocationSync(WebViewId.Home))
    await store.dispatch(webviewsLocationSync(WebViewId.Home))

    expect(webViewBridgeAdapter.callBridgeFunction).toHaveBeenCalledTimes(1)
    expect(webViewBridgeAdapter.callBridgeFunction).toHaveBeenCalledWith(
      WebViewId.Home,
      SpartacusBridge.FunctionCall.Target.GeolocationSetLocation,
      [undefined, undefined],
    )
  })

  it('should set webview user location if the location has changed too much', async () => {
    const store = configureMockStore({
      preloadedState: {
        webviews: { [WebViewId.Home]: { isReady: true, previousSubmittedUserLocationState: null } },
        persisted: { location: { currentUserLocation: definedUserLocationState } },
      } as RootState,
    })

    await store.dispatch(webviewsLocationSync(WebViewId.Home))

    expect(webViewBridgeAdapter.callBridgeFunction).toHaveBeenCalledTimes(1)
    expect(webViewBridgeAdapter.callBridgeFunction).toHaveBeenCalledWith(
      WebViewId.Home,
      SpartacusBridge.FunctionCall.Target.GeolocationSetLocation,
      [definedUserLocationState?.coords.latitude, definedUserLocationState?.coords.longitude],
    )

    store.dispatch(setCurrentUserLocation(changedUserLocationState))

    await store.dispatch(webviewsLocationSync(WebViewId.Home))

    expect(webViewBridgeAdapter.callBridgeFunction).toHaveBeenCalledTimes(2)
    expect(webViewBridgeAdapter.callBridgeFunction).toHaveBeenCalledWith(
      WebViewId.Home,
      SpartacusBridge.FunctionCall.Target.GeolocationSetLocation,
      [changedUserLocationState?.coords.latitude, changedUserLocationState?.coords.longitude],
    )
  })
})
