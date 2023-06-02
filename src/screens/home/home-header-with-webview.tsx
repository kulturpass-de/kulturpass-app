import React from 'react'
import { PropsWithChildren, useEffect, useState } from 'react'
import { WebViewId } from '../../features/spartacus-webview/services/webview-bridge-adapter/types'
import { useWebViewBridgeAdapter } from '../../features/spartacus-webview/services/webview-bridge-adapter/use-webview-bridge-adapter'

export const HomeHeaderWithWebView = ({ children }: PropsWithChildren) => {
  const { bridgeAdapterApi } = useWebViewBridgeAdapter(WebViewId.Home)
  const [showHeader, setShowHeader] = useState(true)

  useEffect(() => {
    const subscription = bridgeAdapterApi.onRouterEvents(event => {
      const url = event.data.url
      // TODO: /product -> better would be to intercept the routing to /product when the user clicks a product
      setShowHeader(url === '/' || url.startsWith('/homepage') || url.startsWith('/product'))
    })

    return () => subscription.unsubscribe()
  }, [bridgeAdapterApi])

  if (showHeader) {
    return <>{children}</>
  }

  return null
}
