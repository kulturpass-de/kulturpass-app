import { RefObject, useCallback } from 'react'
import { Platform } from 'react-native'
import WebView from 'react-native-webview'
import { WebViewSharedProps } from 'react-native-webview/lib/WebViewTypes'
import { injectionService } from '../../../services/webviews/injection-service'

/**
 * This is considered a HACK, since onError or onHttpError should handle that, but they don't.
 *
 * [Android] After every navigation state change, JavaScript code gets injected, that checks for loading errors
 * On certain Android devices, it seems that the loading of the webview fails silently. In that case, the WebView
 * displays a default error screen and we cannot easily retrieve the error. However, there is the chance of retrieving
 * the error by checking if document URL starts with "chrome-error". If that is the case, we can attempt to parse the
 * DOM for the error code, which should start with "net::". If this gets found, it will be sent back via the bridge.
 *
 * https://developer.android.com/guide/topics/connectivity/cronet/reference/org/chromium/net/NetworkException.html#constants
 *
 * The bridge event should have the following object: { source: 'MobileApp', data: 'ERR_UNKNOWN' | other }. Where
 * "other" is the "net::" error string, if found.
 */
export const useHandleWebviewOfflineAndroid = (webViewRef: RefObject<WebView<{}> | null>) => {
  const onLoadProgress = useCallback<NonNullable<WebViewSharedProps['onLoadProgress']>>(
    event => {
      /* for some reason, the most reliable callback for detecting a page load end event
       * is the progress, not 'onLoadEnd' or 'onNavigationStateChange'
       */
      if (Platform.OS === 'android' && (event.nativeEvent.loading === false || event.nativeEvent.progress >= 1.0)) {
        webViewRef.current?.injectJavaScript(injectionService.webviewAndroidOffline())
      }
    },
    [webViewRef],
  )

  return {
    onLoadProgress,
  }
}
