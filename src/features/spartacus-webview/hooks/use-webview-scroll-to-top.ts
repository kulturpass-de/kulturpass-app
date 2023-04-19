import { useScrollToTop } from '@react-navigation/native'
import { RefObject, useMemo } from 'react'
import WebView from 'react-native-webview'

export const useWebViewScrollToTop = (webViewRef: RefObject<WebView<{}> | null>) => {
  const webViewScrollWrapper: RefObject<{ scrollToTop(): void }> = useMemo(
    () => ({
      current: {
        scrollToTop: () => {
          webViewRef.current?.injectJavaScript(`
        window.scroll({
          top: 0, 
          left: 0, 
          behavior: 'smooth'
        }); true;
      `)
        },
      },
    }),
    [webViewRef],
  )
  useScrollToTop(webViewScrollWrapper)
}
