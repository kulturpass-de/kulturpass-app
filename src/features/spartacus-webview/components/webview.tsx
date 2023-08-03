import React, { useCallback, useEffect } from 'react'
import { Animated, Platform, StyleSheet } from 'react-native'
import { WebView, WebViewProps } from 'react-native-webview'
import { OnShouldStartLoadWithRequest } from 'react-native-webview/lib/WebViewTypes'
import { useSelector } from 'react-redux'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { useTabsNavigation } from '../../../navigation/tabs/hooks'
import { getCurrentUserLocation } from '../../../services/location/redux/location-selectors'
import { colors } from '../../../theme/colors'
import { openLink } from '../../../utils/links/utils'
import { ProductDetailRouteConfig } from '../../product-detail/screens/product-detail-route'
import { AccountVerifiedWebViewHandler } from '../../registration/components/account-verified-alert/account-verified-webview-handler'
import { useHandleWebviewErrors } from '../hooks/use-handle-webview-errors'
import { useHandleWebviewNavigation } from '../hooks/use-handle-webview-navigation'
import { useHandleWebviewOfflineAndroid } from '../hooks/use-handle-webview-offline-android'
import { useOpenProductDetail } from '../hooks/use-open-product-detail'
import { useOrigin } from '../hooks/use-origin'
import { useWebViewContentOffset } from '../hooks/use-webview-content-offset'
import { useWebViewLanguageSync } from '../hooks/use-webview-language-sync'
import { useWebViewScrollToTop } from '../hooks/use-webview-scroll-to-top'
import { WebViewId } from '../services/webview-bridge-adapter/types'
import { useWebviewAndroidPullToRefresh } from '../services/webview-bridge-adapter/use-webview-android-pull-to-refresh'
import { useWebViewAuthSync } from '../services/webview-bridge-adapter/use-webview-auth-sync'
import { useWebViewBridgeAdapter } from '../services/webview-bridge-adapter/use-webview-bridge-adapter'
import { useWebViewLocationSync } from '../services/webview-bridge-adapter/use-webview-location-sync'
import { WebviewErrorView } from './webview-error-view'
import { WebviewLoadingIndicator } from './webview-loading-indicator'

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
  const { onMessage, webViewRef, bridgeAdapterApi, webViewBridgeAdapter } = useWebViewBridgeAdapter(webViewId)
  const modalNavigation = useModalNavigation()

  const origin = useOrigin(url)

  const handleShouldLoadRequest: OnShouldStartLoadWithRequest = useCallback(
    e => {
      let isSamePage: boolean
      // TODO: Cleanup / Deduplicate code with useOpenProductDetail hook
      // Fixes PDP opened in banner subpage not working properly (home screen is white after)
      if (webViewId === WebViewId.Home && e.url.startsWith(origin)) {
        const productCode = e.url.match(/.*\/product\/([^?/]+)/)?.[1]
        if (productCode) {
          const isRandomMode = e.url.includes('randomMode=true')
          modalNavigation.navigate({
            screen: ProductDetailRouteConfig.name,
            params: {
              productCode: productCode,
              randomMode: isRandomMode,
            },
          })
          return false
        }
      }
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
    [modalNavigation, origin, webViewId],
  )
  const renderLoading = useCallback(() => <WebviewLoadingIndicator contentOffset={contentOffset} />, [contentOffset])

  const { errorCode, resetError, handleError, handleHttpError } = useHandleWebviewErrors(bridgeAdapterApi)

  const reload = useCallback(() => {
    resetError()
    webViewRef.current?.reload()
  }, [resetError, webViewRef])

  useWebViewAuthSync(webViewId, bridgeAdapterApi)

  const currentUserLocation = useSelector(getCurrentUserLocation)
  useWebViewLocationSync(webViewId, bridgeAdapterApi, currentUserLocation)

  useOpenProductDetail(bridgeAdapterApi)

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
    const unsubscribe = navigation.addListener('tabPress', e => {
      if (e.target?.startsWith(webViewId)) {
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
          source={{ uri }}
          ref={webViewRef}
          onMessage={onMessage}
          {...props}
          onLoadProgress={onLoadProgress}
          onLoadEnd={applyWebviewDocumentBodyOffset}
          style={[styles.webview, style]}
          onScroll={onScroll}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
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
  webview: {
    backgroundColor: colors.basicBackground,
  },
})
