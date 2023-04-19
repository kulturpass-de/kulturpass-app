import WebView, { WebViewMessageEvent } from 'react-native-webview'
import { v4 as uuid } from 'uuid'

import { env } from '../../../../env'
import {
  BridgeFCNonParsableJson,
  BridgeFCSameWebViewId,
  BridgeFCTimeout,
  BridgeFCUnknownTypeResponse,
  getWebViewFunctionResultError,
} from './errors'
import { EventEmitter, Subscription } from './event-emitter'
import { SpartacusBridge } from './spartacus-bridge'
import { isWebViewFunctionResult, isAnyWebViewEvent, isWebViewEvent, isAnyWebViewFunctionResult } from './type-guards'
import { IBridgeAdapter, WebViewFunctions, WebViewEvents, WebViewId, WebViewBridgeAdapterEventsMap } from './types'

/**
 * The WebViewBridgeAdapter handles commincation between the app and the website inside some WebView.
 * Communication is done by injecting Javascript through the WebView with `injectJavaScript(message)`
 * and handling messages sent by the website.
 */
export class WebViewBridgeAdapter implements IBridgeAdapter {
  protected eventEmitter = new EventEmitter<WebViewBridgeAdapterEventsMap>()
  protected availableWebViews = new Map<WebViewId, WebView>()

  public async callBridgeFunction<WebViewFunctionName extends keyof WebViewFunctions>(
    webViewId: WebViewId,
    target: WebViewFunctionName,
    args: WebViewFunctions[WebViewFunctionName]['arguments'],
  ) {
    const webView = this.availableWebViews.get(webViewId)

    if (!webView) {
      return undefined
    }

    const request: SpartacusBridge.FunctionCall.Request<
      WebViewFunctionName,
      WebViewFunctions[WebViewFunctionName]['arguments']
    > = { target, arguments: args, id: uuid() }

    const script = `window.postMessage(${JSON.stringify(JSON.stringify(request))}); true;`

    webView.injectJavaScript(script)

    return new Promise<WebViewFunctions[WebViewFunctionName]['result']>((resolve, reject) => {
      let subscription: Subscription

      const timeout = setTimeout(() => {
        subscription.unsubscribe()
        reject(new BridgeFCTimeout())
      }, env.BRIDGE_FC_DEFAULT_TIMEOUT_MS)

      /**
       * Create a subscription for receiving a response from the web page rendered by the WebView. The response should
       * have the same `id` property as the request that was injected as a script.
       */
      subscription = this.eventEmitter.addListener('handleWebViewFunctionResult', event => {
        if (event.webViewId === webViewId && isWebViewFunctionResult<WebViewFunctionName>(event.object, request.id)) {
          clearTimeout(timeout)
          subscription.unsubscribe()

          const error = getWebViewFunctionResultError(event.object)
          if (error) {
            return reject(error)
          }

          resolve(event.object)
        }
      })
    })
  }

  public webviewMessageHandler(webViewId: WebViewId, event: WebViewMessageEvent) {
    let object
    try {
      object = JSON.parse(event.nativeEvent.data)
    } catch (error) {
      const { message, name: type } = error as Error
      throw new BridgeFCNonParsableJson(undefined, message, type)
    }

    if (isAnyWebViewEvent(object)) {
      this.eventEmitter.emit('handleWebViewEvent', { webViewId, object })
      return
    }

    if (isAnyWebViewFunctionResult(object)) {
      this.eventEmitter.emit('handleWebViewFunctionResult', { webViewId, object })
      return
    }

    throw new BridgeFCUnknownTypeResponse(undefined, object)
  }

  public onWebViewEvent<Source extends keyof WebViewEvents>(
    webViewId: WebViewId,
    source: Source,
    callback: (object: WebViewEvents[Source]) => void,
  ) {
    const subscription = this.eventEmitter.addListener('handleWebViewEvent', event => {
      if (event.webViewId === webViewId && isWebViewEvent(event.object, source)) {
        callback(event.object)
      }
    })

    return subscription
  }

  public connectWebView(webViewId: WebViewId, webView: WebView) {
    if (this.availableWebViews.has(webViewId)) {
      throw new BridgeFCSameWebViewId(undefined, webViewId)
    }

    this.availableWebViews.set(webViewId, webView)

    const disconnectWebView = () => {
      this.availableWebViews.delete(webViewId)
    }

    return disconnectWebView
  }
}

export const webViewBridgeAdapter = new WebViewBridgeAdapter()
