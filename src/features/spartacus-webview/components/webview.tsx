import React, { useCallback, useMemo } from 'react'
import { Platform, StyleSheet, ViewProps } from 'react-native'
import { WebView, WebViewProps } from 'react-native-webview'
import { useDispatch, useSelector } from 'react-redux'

import { getCommerceAccessToken } from '../../../services/auth/store/auth-selectors'
import { getCurrentUserLocation } from '../../../services/location/redux/location-selectors'
import { useOpenProductDetail } from '../hooks/use-open-product-detail'
import { useWebViewScrollToTop } from '../hooks/use-webview-scroll-to-top'
import { WebViewId } from '../services/webview-bridge-adapter/types'
import { AuthApi, useWebViewAuthSync } from '../services/webview-bridge-adapter/use-webview-auth-sync'
import { useWebViewBridgeAdapter } from '../services/webview-bridge-adapter/use-webview-bridge-adapter'
import { useWebViewLocationSync } from '../services/webview-bridge-adapter/use-webview-location-sync'
import { useOrigin } from '../hooks/use-origin'
import { OnShouldStartLoadWithRequest } from 'react-native-webview/lib/WebViewTypes'
import { WebviewLoadingIndicator } from './webview-loading-indicator'
import { WebviewErrorView } from './webview-error-view'
import { useHandleWebviewNavigation } from '../hooks/use-handle-webview-navigation'
import { colors } from '../../../theme/colors'
import { useHandleWebviewErrors } from '../hooks/use-handle-webview-errors'
import { AppDispatch } from '../../../services/redux/configure-store'
import { authCommerceLogin } from '../../../services/auth/store/thunks/auth-commerce-login'
import { authLogout } from '../../../services/auth/store/thunks/auth-logout'

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

  const origin = useOrigin(url)

  const handleShouldLoadRequest: OnShouldStartLoadWithRequest = useCallback(
    e => {
      if (Platform.OS === 'ios') {
        // iOS invokes this function for each text/html request. Therefore using mainDocumentURL (iOS only)
        return e.mainDocumentURL?.startsWith(origin) === true
      } else {
        // Android does not invoke function on single page apps https://github.com/react-native-webview/react-native-webview/issues/1869
        return e.url.startsWith(origin)
      }
    },
    [origin],
  )
  const renderLoading = useCallback(() => <WebviewLoadingIndicator />, [])

  const { errorCode, resetError, handleError, handleHttpError } = useHandleWebviewErrors()

  const reload = useCallback(() => {
    resetError()
    webViewRef.current?.reload()
  }, [resetError, webViewRef])

  const dispatch = useDispatch<AppDispatch>()
  const commerceAccessToken = useSelector(getCommerceAccessToken)

  const authApi: AuthApi = useMemo(() => {
    return {
      login: () => {
        return dispatch(authCommerceLogin(commerceAccessToken.cdc!)).unwrap()
      },
      logout: () => {
        return dispatch(authLogout()).unwrap()
      },
    }
  }, [dispatch, commerceAccessToken])

  useWebViewAuthSync(bridgeAdapterApi, bridgeAdapterState, commerceAccessToken, authApi)

  const currentUserLocation = useSelector(getCurrentUserLocation)
  useWebViewLocationSync(bridgeAdapterApi, bridgeAdapterState, currentUserLocation)

  useOpenProductDetail(bridgeAdapterApi)

  useHandleWebviewNavigation(bridgeAdapterApi)

  useWebViewScrollToTop(webViewRef)

  let uri = url
  if (commands) {
    uri += '/' + commands.join('/')
  }

  return (
    <>
      <WebView
        style={styles.webview}
        onShouldStartLoadWithRequest={handleShouldLoadRequest}
        startInLoadingState
        pullToRefreshEnabled
        onError={handleError}
        onHttpError={handleHttpError}
        renderLoading={renderLoading}
        source={{ uri }}
        ref={webViewRef}
        onMessage={onMessage}
        {...props}
      />
      {errorCode !== undefined ? <WebviewErrorView onRefresh={reload} errorCode={errorCode} /> : null}
    </>
  )
}

const styles = StyleSheet.create({
  webview: {
    backgroundColor: colors.basicBackground,
  },
})
