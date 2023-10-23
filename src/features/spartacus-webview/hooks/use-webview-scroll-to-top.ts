import { useScrollToTop } from '@react-navigation/native'
import { RefObject, useMemo } from 'react'
import WebView from 'react-native-webview'
import { injectionService } from '../../../services/webviews/injection-service'

export const useWebViewScrollToTop = (webViewRef: RefObject<WebView<{}> | null>) => {
  const webViewScrollWrapper: RefObject<{ scrollToTop(): void }> = useMemo(
    () => ({
      current: {
        scrollToTop: () => {
          webViewRef.current?.injectJavaScript(injectionService.webviewScrollToTop())
        },
      },
    }),
    [webViewRef],
  )
  useScrollToTop(webViewScrollWrapper)
}
