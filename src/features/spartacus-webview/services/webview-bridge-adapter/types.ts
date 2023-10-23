import WebView, { WebViewMessageEvent } from 'react-native-webview'
import { ValueOf } from '../../../../utils/types'
import { Subscription } from './event-emitter'
import { SpartacusBridge } from './spartacus-bridge'

export enum WebViewId {
  'Home' = 'Home',
  'Search' = 'Search',
}

/**
 * WebViewFunctions
 */

export type WebViewFunctions = {
  [SpartacusBridge.FunctionCall.Target.AuthLogin]: {
    arguments: SpartacusBridge.FunctionCall.AuthLogin.Request['arguments']
    result: SpartacusBridge.FunctionCall.AuthLogin.Result
  }
  [SpartacusBridge.FunctionCall.Target.AuthLogout]: {
    arguments: SpartacusBridge.FunctionCall.AuthLogout.Request['arguments']
    result: SpartacusBridge.FunctionCall.AuthLogout.Result
  }
  [SpartacusBridge.FunctionCall.Target.RouterNavigate]: {
    arguments: SpartacusBridge.FunctionCall.RouterNavigate.Request['arguments']
    result: SpartacusBridge.FunctionCall.RouterNavigate.Result
  }
  [SpartacusBridge.FunctionCall.Target.GeolocationSetLocation]: {
    arguments: SpartacusBridge.FunctionCall.GeolocationSetLocation.Request['arguments']
    result: SpartacusBridge.FunctionCall.GeolocationSetLocation.Result
  }
  [SpartacusBridge.FunctionCall.Target.UserProfileRefresh]: {
    arguments: SpartacusBridge.FunctionCall.UserProfileRefresh.Request['arguments']
    result: SpartacusBridge.FunctionCall.UserProfileRefresh.Result
  }
}

export type AnyWebViewFunctionResult = ValueOf<WebViewFunctions>['result']

/**
 * WebViewEvents
 */

export type WebViewEvents = {
  [SpartacusBridge.EventForwarding.Source.MobileApp]: SpartacusBridge.EventForwarding.MobileAppEvent
  [SpartacusBridge.EventForwarding.Source.RouterEvents]: SpartacusBridge.EventForwarding.RouterEvent
  [SpartacusBridge.EventForwarding.Source.Bridge]: SpartacusBridge.EventForwarding.BridgeReadyEvent
  [SpartacusBridge.EventForwarding.Source.Auth]: SpartacusBridge.EventForwarding.AuthTokenAwaitedEvent
  [SpartacusBridge.EventForwarding.Source.Search]: SpartacusBridge.EventForwarding.SearchLocationOpenEvent
  [SpartacusBridge.StateForwarding.Source.AuthIsUserLoggedIn]: SpartacusBridge.StateForwarding.StateChange
}

export type AnyWebViewEvent = ValueOf<WebViewEvents>

/**
 * WebViewBridgeAdapter
 */

export type WebViewBridgeAdapterEventsMap = {
  handleWebViewFunctionResult: {
    webViewId: WebViewId
    object: AnyWebViewFunctionResult
  }
  handleWebViewEvent: {
    webViewId: WebViewId
    object: AnyWebViewEvent
  }
}

export interface IBridgeAdapter {
  /**
   * This method will send a request for a specific command to be executed in a specific WebView. The whole procedure of
   * sending a request from WebViewBridgeAdapter to the rendered web page inside a WebView and waiting for a response is
   * wrapped in the retured Promise with a timeout. The specified WebView might not be connected by Ref at the time of
   * sending the request to it, which will resolve the mentioned Promise to `undefined`.
   */
  callBridgeFunction<WebViewFunctionName extends keyof WebViewFunctions>(
    webViewId: WebViewId,
    target: WebViewFunctionName,
    args: WebViewFunctions[WebViewFunctionName]['arguments'],
  ): Promise<undefined | WebViewFunctions[WebViewFunctionName]['result']>

  /**
   * This method is used by the WebViews, to pass messages that are being send by the web pages they render, to the
   * WebViewBridgeAdapter for further processing and forwarding.
   */
  webviewMessageHandler(webViewId: WebViewId, event: WebViewMessageEvent): void

  /**
   * This method lets you subscribe to messages, sent by the web page rendered in the specified WebView, that contain
   * the given source property.
   */
  onWebViewEvent<Source extends keyof WebViewEvents>(
    webViewId: WebViewId,
    source: Source,
    callback: (object: WebViewEvents[Source]) => void,
  ): Subscription

  /**
   * This method is used by the WebViews, to receive scripts that they should inject in the web pages that they render.
   */
  connectWebView(webViewId: WebViewId, webView: WebView): () => void

  /**
   * Go to uri if document.location does not match with uri
   */
  goToPage(webViewId: WebViewId, uri: string): void

  /**
   * Scroll current page to the top
   */
  scrollToTop(webViewId: WebViewId): void
}
