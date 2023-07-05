import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { WebViewId } from '../../features/spartacus-webview/services/webview-bridge-adapter/types'
import { selectWebViewState } from '../../services/webviews/redux/webviews-selectors'

export const HomeHeaderWithWebView: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [showHeader, setShowHeader] = useState(true)
  const { routerUrl: url } = useSelector(state => selectWebViewState(state, WebViewId.Home))

  useEffect(() => {
    if (!url) {
      return
    }

    // TODO: /product -> better would be to intercept the routing to /product when the user clicks a product
    setShowHeader(url === '/' || url.startsWith('/homepage') || url.startsWith('/product'))
  }, [url])

  if (showHeader) {
    return <>{children}</>
  }

  return null
}
