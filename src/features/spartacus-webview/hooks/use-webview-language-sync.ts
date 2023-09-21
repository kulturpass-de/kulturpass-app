import { RefObject, useEffect, useState } from 'react'
import WebView from 'react-native-webview'
import { injectionService } from '../../../services/webviews/injection-service'

export const useWebViewLanguageSync = (webViewRef: RefObject<WebView<{}> | null>, language: string) => {
  const [isFirstLoad, setIsFirstLoad] = useState(true)

  useEffect(() => {
    webViewRef.current?.injectJavaScript(injectionService.webviewSetLanguage(language, isFirstLoad))

    if (isFirstLoad) {
      setIsFirstLoad(false)
    }
  }, [webViewRef, language, isFirstLoad])
}
