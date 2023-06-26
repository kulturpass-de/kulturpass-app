import React, { useCallback, useEffect } from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import { WebView, WebViewProps } from 'react-native-webview'
import { useDispatch, useSelector } from 'react-redux'

import { OnShouldStartLoadWithRequest } from 'react-native-webview/lib/WebViewTypes'
import {
  getCdcSessionData,
  getCommerceSessionData,
  getIsUserLoggedIn,
} from '../../../services/auth/store/auth-selectors'
import { getCurrentUserLocation } from '../../../services/location/redux/location-selectors'
import { AppDispatch } from '../../../services/redux/configure-store'
import { colors } from '../../../theme/colors'
import { useHandleWebviewErrors } from '../hooks/use-handle-webview-errors'
import { useHandleWebviewNavigation } from '../hooks/use-handle-webview-navigation'
import { useOpenProductDetail } from '../hooks/use-open-product-detail'
import { useOrigin } from '../hooks/use-origin'
import { useWebViewScrollToTop } from '../hooks/use-webview-scroll-to-top'
import { WebViewId } from '../services/webview-bridge-adapter/types'
import { useWebViewAuthSync } from '../services/webview-bridge-adapter/use-webview-auth-sync'
import { useWebViewBridgeAdapter } from '../services/webview-bridge-adapter/use-webview-bridge-adapter'
import { useWebViewLocationSync } from '../services/webview-bridge-adapter/use-webview-location-sync'
import { WebviewErrorView } from './webview-error-view'
import { WebviewLoadingIndicator } from './webview-loading-indicator'
import { AccountVerifiedWebViewHandler } from '../../registration/components/account-verified-alert/account-verified-webview-handler'
import { useWebViewLanguageSync } from '../hooks/use-webview-language-sync'
import { useWebviewAndroidPullToRefresh } from '../services/webview-bridge-adapter/use-webview-android-pull-to-refresh'
import { useWebViewContentOffset } from '../hooks/use-webview-content-offset'
import { openLink } from '../../../utils/links/utils'
import { useTabsNavigation } from '../../../navigation/tabs/hooks'

type SpartacusWebViewProps = {
  webViewId: WebViewId
  commands?: string[]
  url: string
  onScroll?: WebViewProps['onScroll']
  language: string
  contentOffset?: number
} & Omit<WebViewProps, 'ref' | 'onLoadEnd'>

/**
 * SpartacusWebView wraps the WebView component and connects it to WebViewBridgeAdapter.
 */
export const SpartacusWebView: React.FC<SpartacusWebViewProps> = ({
  webViewId,
  url,
  commands,
  language,
  style,
  contentOffset,
  ...props
}) => {
  const { onMessage, webViewRef, bridgeAdapterApi, bridgeAdapterState, setBridgeAdapterState, webViewBridgeAdapter } =
    useWebViewBridgeAdapter(webViewId)

  const origin = useOrigin(url)

  const handleShouldLoadRequest: OnShouldStartLoadWithRequest = useCallback(
    e => {
      let isSamePage: boolean
      if (Platform.OS === 'ios') {
        // iOS invokes this function for each text/html request. Therefore using mainDocumentURL (iOS only)
        isSamePage = e.mainDocumentURL?.startsWith(origin) === true
      } else {
        // Android does not invoke function on single page apps https://github.com/react-native-webview/react-native-webview/issues/1869
        isSamePage = e.url.startsWith(origin)
      }
      if (!isSamePage) {
        openLink(e.url)
      }
      return isSamePage
    },
    [origin],
  )
  const renderLoading = useCallback(() => <WebviewLoadingIndicator contentOffset={contentOffset} />, [contentOffset])

  const { errorCode, resetError, handleError, handleHttpError } = useHandleWebviewErrors()

  const reload = useCallback(() => {
    resetError()
    webViewRef.current?.reload()
  }, [resetError, webViewRef])

  const onLoadStart = useCallback(() => {
    if (bridgeAdapterState.isReady) {
      setBridgeAdapterState({ ...bridgeAdapterState, isReady: false })
    }
  }, [bridgeAdapterState, setBridgeAdapterState])

  const dispatch = useDispatch<AppDispatch>()
  const isUserLoggedIn = useSelector(getIsUserLoggedIn)
  const cdcSessionData = useSelector(getCdcSessionData)
  const commerceSessionData = useSelector(getCommerceSessionData)
  useWebViewAuthSync(
    bridgeAdapterApi,
    bridgeAdapterState,
    dispatch,
    isUserLoggedIn,
    cdcSessionData,
    commerceSessionData,
  )

  const currentUserLocation = useSelector(getCurrentUserLocation)
  useWebViewLocationSync(bridgeAdapterApi, bridgeAdapterState, currentUserLocation)

  useOpenProductDetail(bridgeAdapterApi)

  useHandleWebviewNavigation(bridgeAdapterApi)

  useWebViewScrollToTop(webViewRef)

  useWebViewLanguageSync(webViewRef, language)

  const { setContentOffset } = useWebViewContentOffset(webViewRef, contentOffset)

  const { onScroll, onTouchEnd, onTouchStart } = useWebviewAndroidPullToRefresh({
    onScroll: props.onScroll,
    webViewRef,
  })

  const navigation = useTabsNavigation()

  let uri = url
  if (commands) {
    uri += '/' + commands.join('/')
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', e => {
      if (e.target?.startsWith(webViewId)) {
        webViewBridgeAdapter.goToPage(webViewId, uri)
        webViewBridgeAdapter.scrollToTop(webViewId)
      }
    })

    return unsubscribe
  }, [navigation, uri, webViewBridgeAdapter, webViewId])

  return (
    <View style={styles.container}>
      <AccountVerifiedWebViewHandler bridgeAdapterApi={bridgeAdapterApi} />
      <WebView
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
        onLoadEnd={setContentOffset}
        onLoadStart={onLoadStart}
        style={[styles.webview, style]}
        onScroll={onScroll}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      />
      {errorCode !== undefined ? (
        <WebviewErrorView style={{ paddingTop: contentOffset }} onRefresh={reload} errorCode={errorCode} />
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  webview: {
    backgroundColor: colors.basicBackground,
  },
})
