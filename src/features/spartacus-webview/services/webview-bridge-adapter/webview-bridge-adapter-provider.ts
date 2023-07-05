import { createContext, useContext } from 'react'
import { WebViewBridgeAdapter } from './webview-bridge-adapter'

export const WebViewBridgeAdapterContext = createContext<WebViewBridgeAdapter | null>(null)

export const useWebViewBridgeAdapterContext = () => {
  const webViewBridgeAdapter = useContext(WebViewBridgeAdapterContext)

  if (!webViewBridgeAdapter) {
    throw new Error('useWebViewBridgeAdapterContext was used outside of WebViewBridgeAdapterContext.Provider')
  }

  return webViewBridgeAdapter
}
