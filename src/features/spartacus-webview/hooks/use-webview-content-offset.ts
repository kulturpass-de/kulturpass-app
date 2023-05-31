import { RefObject, useCallback, useEffect } from 'react'
import WebView from 'react-native-webview'

export const useWebViewContentOffset = (webViewRef: RefObject<WebView<{}> | null>, contentOffset?: number) => {
  useEffect(() => {
    if (contentOffset === undefined) {
      return
    }
    webViewRef.current?.injectJavaScript(`
      document.body.style.paddingTop = "${contentOffset}px";
      // Don't remove
      true;
    `)
  }, [webViewRef, contentOffset])

  /**
   * Set contentOffset whenever the pages finishes the loading
   * Otherwise it will not have the padding if the user refreshes
   * the pages manually
   */
  const setContentOffset = useCallback(() => {
    if (contentOffset === undefined) {
      return
    }
    webViewRef.current?.injectJavaScript(`
      document.body.style.paddingTop = "${contentOffset}px";
      // Don't remove
      true;
    `)
  }, [webViewRef, contentOffset])

  return {
    setContentOffset,
  }
}
