import { useCallback, useEffect, useMemo, useRef } from 'react'
import WebView, { WebViewMessageEvent } from 'react-native-webview'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../../services/redux/configure-store'
import { webviewsSlice } from '../../../../services/webviews/redux/webviews-slice'
import { createBridgeAdapterApi } from './create-bridge-adapter-api'
import { WebViewId } from './types'
import { useWebViewBridgeAdapterContext } from './webview-bridge-adapter-provider'

export const useWebViewBridgeAdapter = (webViewId: WebViewId) => {
  const webViewBridgeAdapter = useWebViewBridgeAdapterContext()
  const dispatch = useDispatch<AppDispatch>()
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
        dispatch(webviewsSlice.actions.setWebViewState({ webViewId, state: { isReady: true } }))
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [bridgeAdapterApi, dispatch, webViewId])

  return { webViewRef, onMessage, bridgeAdapterApi, webViewBridgeAdapter }
}
