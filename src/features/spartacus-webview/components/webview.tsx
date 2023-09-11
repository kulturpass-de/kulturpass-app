import React, { useCallback, useEffect, useRef } from 'react'
import { Animated, Platform, StyleSheet } from 'react-native'
import { WebView, WebViewProps } from 'react-native-webview'
import { OnShouldStartLoadWithRequest } from 'react-native-webview/lib/WebViewTypes'
import { useTabsNavigation } from '../../../navigation/tabs/hooks'
import { logger } from '../../../services/logger'
import { openLink } from '../../../utils/links/utils'
import { userAgent } from '../../../utils/user-agent/utils'
import { AccountVerifiedWebViewHandler } from '../../registration/components/account-verified-alert/account-verified-webview-handler'
import { useHandleWebviewErrors } from '../hooks/use-handle-webview-errors'
import { useHandleWebviewNavigation } from '../hooks/use-handle-webview-navigation'
import { useHandleWebviewOfflineAndroid } from '../hooks/use-handle-webview-offline-android'
import { useNavigateToPDP } from '../hooks/use-navigate-to-pdp'
import { useOpenLocationSharing } from '../hooks/use-open-location-sharing'
import { useOpenProductDetail } from '../hooks/use-open-product-detail'
import { useOrigin } from '../hooks/use-origin'
import { useWebViewContentOffset } from '../hooks/use-webview-content-offset'
import { useWebViewLanguageSync } from '../hooks/use-webview-language-sync'
import { useWebViewScrollToTop } from '../hooks/use-webview-scroll-to-top'
import { WebViewId } from '../services/webview-bridge-adapter/types'
import { useWebviewAndroidPullToRefresh } from '../services/webview-bridge-adapter/use-webview-android-pull-to-refresh'
import { useWebViewAuthSync } from '../services/webview-bridge-adapter/use-webview-auth-sync'
import { useWebViewBridgeAdapter } from '../services/webview-bridge-adapter/use-webview-bridge-adapter'
import { WebviewErrorView } from './webview-error-view'
import { WebviewLoadingIndicator } from './webview-loading-indicator'

type SpartacusWebViewProps = {
  webViewId: WebViewId
  commands?: string[]
  url: string
  initialNavigationUrl?: string
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
  initialNavigationUrl,
  commands,
  language,
  style,
  contentOffset,
  ...props
}) => {
  const { onMessage, webViewRef, bridgeAdapterApi, webViewBridgeAdapter } = useWebViewBridgeAdapter(webViewId)
  // If there is an initial navigation URL we start the webview with it.
  // The alternative (waiting for a bridge ready event and navigating over the bridge is) is not stable,
  // as we might need to reload on startup for language sync.
  // This is only important for the first website load.
  const initialUrl = useRef(initialNavigationUrl)
  const navigateToPDP = useNavigateToPDP()

  const origin = useOrigin(url)

  const handleShouldLoadRequest: OnShouldStartLoadWithRequest = useCallback(
    event => {
      let isSamePage: boolean
      const eventUrl = new URL(event.url)
      // Fixes PDP opened in banner subpage not working properly (home screen is white after).
      // Use https, as links could potentially be http
      if (webViewId === WebViewId.Home && 'https://' + eventUrl.hostname === origin) {
        const navigatedToPDP = navigateToPDP(event)

        if (navigatedToPDP === true) {
          return false
        }
      }
      if (Platform.OS === 'ios') {
        // iOS invokes this function for each text/html request. Therefore using mainDocumentURL (iOS only)
        isSamePage = event.mainDocumentURL?.startsWith(origin) === true
      } else {
        // Android does not invoke function on single page apps https://github.com/react-native-webview/react-native-webview/issues/1869
        isSamePage = event.url.startsWith(origin)
      }
      if (!isSamePage) {
        openLink(event.url).catch(logger.logError)
      }
      return isSamePage
    },
    [origin, webViewId, navigateToPDP],
  )
  const renderLoading = useCallback(() => <WebviewLoadingIndicator contentOffset={contentOffset} />, [contentOffset])

  const { errorCode, resetError, handleError, handleHttpError } = useHandleWebviewErrors(bridgeAdapterApi)

  const reload = useCallback(() => {
    resetError()
    webViewRef.current?.reload()
  }, [resetError, webViewRef])

  useWebViewAuthSync(webViewId, bridgeAdapterApi)

  useOpenProductDetail(bridgeAdapterApi)

  useOpenLocationSharing(bridgeAdapterApi)

  useHandleWebviewNavigation(webViewId, bridgeAdapterApi)

  useWebViewScrollToTop(webViewRef)

  useWebViewLanguageSync(webViewRef, language)

  const { onLoadProgress } = useHandleWebviewOfflineAndroid(webViewRef)

  const {
    applyWebviewDocumentBodyOffset,
    outerContainerMarginTop,
    innerContainerNegativeMarginTop,
    adjustContainerOffsetMargins,
  } = useWebViewContentOffset(webViewRef, contentOffset)

  const { onScroll, onTouchEnd, onTouchStart } = useWebviewAndroidPullToRefresh({
    onScroll: event => {
      adjustContainerOffsetMargins(event)
      props.onScroll?.(event)
    },
    webViewRef,
  })

  const navigation = useTabsNavigation()

  let uri = url
  if (commands) {
    uri += '/' + commands.join('/')
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', event => {
      if (event.target?.startsWith(webViewId)) {
        webViewBridgeAdapter.goToPage(webViewId, uri)
        webViewBridgeAdapter.scrollToTop(webViewId)
      }
    })

    return unsubscribe
  }, [navigation, uri, webViewBridgeAdapter, webViewId])

  return (
    <Animated.View style={[styles.container, { marginTop: outerContainerMarginTop.current }]}>
      <Animated.View style={[styles.inner, { marginTop: innerContainerNegativeMarginTop.current }]}>
        <AccountVerifiedWebViewHandler bridgeAdapterApi={bridgeAdapterApi} />
        <WebView
          onShouldStartLoadWithRequest={handleShouldLoadRequest}
          startInLoadingState
          pullToRefreshEnabled
          onError={handleError}
          onHttpError={handleHttpError}
          renderLoading={renderLoading}
          source={{ uri: initialUrl.current ? origin + initialUrl.current : uri }}
          ref={webViewRef}
          onMessage={onMessage}
          {...props}
          onLoadProgress={onLoadProgress}
          onLoadEnd={applyWebviewDocumentBodyOffset}
          style={[styles.transparentBackground, style]}
          containerStyle={styles.transparentBackground}
          onScroll={onScroll}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          autoManageStatusBarEnabled={false}
          applicationNameForUserAgent={userAgent}
        />
        {errorCode !== undefined ? (
          <WebviewErrorView style={{ paddingTop: contentOffset }} onRefresh={reload} errorCode={errorCode} />
        ) : null}
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    height: '100%',
  },
  inner: {
    height: '100%',
  },
  transparentBackground: {
    backgroundColor: 'transparent',
  },
})
