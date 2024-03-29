import { RefObject, useCallback } from 'react'
import WebView from 'react-native-webview'
import { injectionService } from '../../../services/webviews/injection-service'

export const useWebViewChangeTitle = (webViewRef: RefObject<WebView<{}> | null>, title?: string) => {
  const webviewChangeTitle = useCallback(() => {
    if (title !== undefined) {
      webViewRef.current?.injectJavaScript(injectionService.webviewChangeTitle(title))
    }
  }, [webViewRef, title])

  return webviewChangeTitle
}
