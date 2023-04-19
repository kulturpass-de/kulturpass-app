import React from 'react'
import { ViewProps } from 'react-native'
import { WebView, WebViewProps } from 'react-native-webview'
import { useSelector } from 'react-redux'

import { getCommerceAccessToken } from '../../../services/auth/store/auth-selectors'
import { getCurrentUserLocation } from '../../../services/location/redux/location-selectors'
import { useOpenProductDetail } from '../hooks/use-open-product-detail'
import { useWebViewScrollToTop } from '../hooks/use-webview-scroll-to-top'
import { WebViewId } from '../services/webview-bridge-adapter/types'
import { useWebViewAuthSync } from '../services/webview-bridge-adapter/use-webview-auth-sync'
import { useWebViewBridgeAdapter } from '../services/webview-bridge-adapter/use-webview-bridge-adapter'
import { useWebViewLocationSync } from '../services/webview-bridge-adapter/use-webview-location-sync'

type SpartacusWebViewProps = {
  webViewId: WebViewId
  commands?: string[]
  url: string
  onScroll?: WebViewProps['onScroll']
} & Omit<ViewProps, 'ref'>

/**
 * SpartacusWebView wraps the WebView component and connects it to WebViewBridgeAdapter.
 */
export const SpartacusWebView: React.FC<SpartacusWebViewProps> = ({ webViewId, url, commands, ...props }) => {
  const { onMessage, webViewRef, bridgeAdapterApi, bridgeAdapterState } = useWebViewBridgeAdapter(webViewId)

  const commerceAccessToken = useSelector(getCommerceAccessToken)
  useWebViewAuthSync(bridgeAdapterApi, bridgeAdapterState, commerceAccessToken)

  const currentUserLocation = useSelector(getCurrentUserLocation)
  useWebViewLocationSync(bridgeAdapterApi, bridgeAdapterState, currentUserLocation)

  useOpenProductDetail(bridgeAdapterApi)

  useWebViewScrollToTop(webViewRef)

  let uri = url
  if (commands) {
    uri += '/' + commands.join('/')
  }

  return <WebView source={{ uri }} ref={webViewRef} onMessage={onMessage} {...props} />
}
