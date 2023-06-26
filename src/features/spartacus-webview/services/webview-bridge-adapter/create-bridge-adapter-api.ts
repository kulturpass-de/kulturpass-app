import { SpartacusBridge } from './spartacus-bridge'
import { WebViewEvents, WebViewId } from './types'
import { WebViewBridgeAdapter } from './webview-bridge-adapter'

export const createBridgeAdapterApi = (webViewBridgeAdapter: WebViewBridgeAdapter, webViewId: WebViewId) => {
  const authLogin = async (commerceAccessToken: string) => {
    const result = await webViewBridgeAdapter.callBridgeFunction(
      webViewId,
      SpartacusBridge.FunctionCall.Target.AuthLogin,
      [{ access_token: commerceAccessToken }],
    )
    webViewBridgeAdapter.reload(webViewId)
    return result
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

  const onRouterEvents = (callback: (object: WebViewEvents['router.events']) => void) => {
    return webViewBridgeAdapter.onWebViewEvent(webViewId, SpartacusBridge.EventForwarding.Source.RouterEvents, callback)
  }

  const onBridge = (callback: (object: WebViewEvents['bridge']) => void) => {
    return webViewBridgeAdapter.onWebViewEvent(webViewId, SpartacusBridge.EventForwarding.Source.Bridge, callback)
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
    onAuthIsUserLoggedIn,
  }
}

export type BridgeAdapterAPI = ReturnType<typeof createBridgeAdapterApi>
