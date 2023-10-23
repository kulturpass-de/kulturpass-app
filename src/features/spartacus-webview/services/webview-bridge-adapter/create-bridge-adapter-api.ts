import { SpartacusBridge } from './spartacus-bridge'
import { WebViewEvents, WebViewId } from './types'
import { WebViewBridgeAdapter } from './webview-bridge-adapter'

export const createBridgeAdapterApi = (webViewBridgeAdapter: WebViewBridgeAdapter, webViewId: WebViewId) => {
  const authLogin = async (commerceAccessToken: string) => {
    return webViewBridgeAdapter.callBridgeFunction(webViewId, SpartacusBridge.FunctionCall.Target.AuthLogin, [
      { access_token: commerceAccessToken },
    ])
  }

  const authLogout = async () => {
    return webViewBridgeAdapter.callBridgeFunction(webViewId, SpartacusBridge.FunctionCall.Target.AuthLogout, [])
  }

  const routerNavigate = async (arg: string[]) => {
    return webViewBridgeAdapter.callBridgeFunction(webViewId, SpartacusBridge.FunctionCall.Target.RouterNavigate, [arg])
  }

  const geolocationSetLocation = async (latitude?: number, longitude?: number) => {
    return webViewBridgeAdapter.callBridgeFunction(
      webViewId,
      SpartacusBridge.FunctionCall.Target.GeolocationSetLocation,
      [latitude, longitude],
    )
  }

  const onMobileAppEvents = (callback: (object: WebViewEvents['MobileApp']) => void) => {
    return webViewBridgeAdapter.onWebViewEvent(webViewId, SpartacusBridge.EventForwarding.Source.MobileApp, callback)
  }

  const onRouterEvents = (callback: (object: WebViewEvents['router.events']) => void) => {
    return webViewBridgeAdapter.onWebViewEvent(webViewId, SpartacusBridge.EventForwarding.Source.RouterEvents, callback)
  }

  const onBridge = (callback: (object: WebViewEvents['bridge']) => void) => {
    return webViewBridgeAdapter.onWebViewEvent(webViewId, SpartacusBridge.EventForwarding.Source.Bridge, callback)
  }

  const onAuth = (callback: (object: WebViewEvents['auth']) => void) => {
    return webViewBridgeAdapter.onWebViewEvent(webViewId, SpartacusBridge.EventForwarding.Source.Auth, callback)
  }

  const onAuthIsUserLoggedIn = (callback: (object: WebViewEvents['auth.isUserLoggedIn']) => void) => {
    return webViewBridgeAdapter.onWebViewEvent(
      webViewId,
      SpartacusBridge.StateForwarding.Source.AuthIsUserLoggedIn,
      callback,
    )
  }

  return {
    authLogin,
    authLogout,
    routerNavigate,
    geolocationSetLocation,
    onRouterEvents,
    onBridge,
    onAuth,
    onAuthIsUserLoggedIn,
    onMobileAppEvents,
  }
}

export type BridgeAdapterAPI = ReturnType<typeof createBridgeAdapterApi>
