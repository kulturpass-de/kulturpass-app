import { RefObject, useCallback } from 'react'
import { Platform } from 'react-native'
import WebView from 'react-native-webview'
import { WebViewSharedProps } from 'react-native-webview/lib/WebViewTypes'

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
        webViewRef.current?.injectJavaScript(`
          try {
            if (/^chrome-error/.test(document.URL)) { 
              // extract all p tags, in order to find the error code
              const pItems = document.querySelectorAll("p")
      
              let errorThrown = false
      
              pItems.forEach(item => {
                let data = item.innerHTML.trim()
      
                // try to find the error code string
                if (!errorThrown && /^net::/.test(data)) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({ source: 'MobileApp', data }))
                  errorThrown = true
                }
              })
      
              if (!errorThrown) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ source: 'MobileApp', data: 'ERR_UNKNOWN' }))
              }
            }
          } catch (error) {
            console.log("Error on injecting JavaScript to detect page load error", error)
          }

        // don't remove
        true;
      `)
      }
    },
    [webViewRef],
  )

  return {
    onLoadProgress,
  }
}
