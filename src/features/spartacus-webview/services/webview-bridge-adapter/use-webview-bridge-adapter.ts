import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import WebView, { WebViewMessageEvent } from 'react-native-webview'

import { createBridgeAdapterApi } from './create-bridge-adapter-api'
import { WebViewId } from './types'
import { useWebViewBridgeAdapterContext } from './webview-bridge-adapter-provider'

export type WebViewBridgeAdapterState = {
  isReady?: boolean
}

export const useWebViewBridgeAdapter = (webViewId: WebViewId) => {
  const webViewBridgeAdapter = useWebViewBridgeAdapterContext()
  const [bridgeAdapterState, setBridgeAdapterState] = useState<WebViewBridgeAdapterState>({})
  const webViewRef = useRef<WebView | null>(null)

  useEffect(() => {
    if (webViewRef.current) {
      const disconnectWebView = webViewBridgeAdapter.connectWebView(webViewId, webViewRef.current)

      return () => {
        disconnectWebView()
      }
    }
  }, [webViewBridgeAdapter, webViewId])

  const onMessage = useCallback(
    (event: WebViewMessageEvent) => {
      try {
        webViewBridgeAdapter.webviewMessageHandler(webViewId, event)
      } catch (e) {
        // Fail silently, as the event format is not correct
        console.warn(e)
      }
    },
    [webViewBridgeAdapter, webViewId],
  )

  const bridgeAdapterApi = useMemo(() => {
    return createBridgeAdapterApi(webViewBridgeAdapter, webViewId)
  }, [webViewBridgeAdapter, webViewId])

  useEffect(() => {
    const subscription = bridgeAdapterApi.onBridge(event => {
      if (event.name === 'ready') {
        setBridgeAdapterState(currentState => ({ ...currentState, isReady: true }))
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [bridgeAdapterApi])

  return { webViewRef, onMessage, bridgeAdapterApi, bridgeAdapterState, setBridgeAdapterState, webViewBridgeAdapter }
}
