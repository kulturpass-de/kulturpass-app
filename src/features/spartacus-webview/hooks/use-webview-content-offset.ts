import { RefObject, useCallback, useEffect, useRef } from 'react'
import { Animated } from 'react-native'
import WebView, { WebViewProps } from 'react-native-webview'

type WebViewScrollEvent = Parameters<NonNullable<WebViewProps['onScroll']>>['0']

export const useWebViewContentOffset = (webViewRef: RefObject<WebView<{}> | null>, contentOffset?: number) => {
  /**
   * Set contentOffset whenever the pages finishes the loading
   * Otherwise it will not have the padding if the user refreshes
   * the pages manually
   */
  const applyWebviewDocumentBodyOffset = useCallback(() => {
    if (contentOffset === undefined) {
      return
    }
    webViewRef.current?.injectJavaScript(`
      document.body.style.paddingTop = "${contentOffset}px";
      // Don't remove
      true;
    `)
  }, [webViewRef, contentOffset])

  useEffect(() => {
    applyWebviewDocumentBodyOffset()
  }, [applyWebviewDocumentBodyOffset])

  const outerContainerMarginTop = useRef(new Animated.Value(0))
  const innerContainerNegativeMarginTop = useRef(new Animated.Value(0))

  const adjustContainerOffsetMargins = useCallback(
    (event?: WebViewScrollEvent) => {
      let scrollOffset = event?.nativeEvent.contentOffset.y || 0
      if (scrollOffset < 0) {
        scrollOffset = 0
      }

      let webviewTopOffset = (contentOffset || 0) - scrollOffset
      if (webviewTopOffset < 0) {
        webviewTopOffset = 0
      }

      outerContainerMarginTop.current.setValue(webviewTopOffset)
      innerContainerNegativeMarginTop.current.setValue(-1 * webviewTopOffset)
    },
    [contentOffset],
  )

  useEffect(() => {
    adjustContainerOffsetMargins()
  }, [adjustContainerOffsetMargins])

  return {
    applyWebviewDocumentBodyOffset,
    outerContainerMarginTop,
    innerContainerNegativeMarginTop,
    adjustContainerOffsetMargins,
  }
}
