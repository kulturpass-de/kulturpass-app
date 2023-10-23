import { RefObject, useEffect, useState } from 'react'
import WebView from 'react-native-webview'

export const useWebViewLanguageSync = (webViewRef: RefObject<WebView<{}> | null>, language: string) => {
  const [isFirstLoad, setIsFirstLoad] = useState(true)

  useEffect(() => {
    // This is intentionally wrapped. Don't remove it
    const languageWrappedWithQuotationMarks = `"${language}"`
    const locationReloadCall = isFirstLoad ? '' : 'location.reload();'

    webViewRef.current?.injectJavaScript(`
      function setLanguage() {
        try {
          localStorage.setItem("spartacus⚿⚿language", '${languageWrappedWithQuotationMarks}');
          ${locationReloadCall}
        } catch (e) { }
      }

      // Without this, we get the warning from webkit:
      // "The operation is insecure."
      // See: https://stackoverflow.com/questions/43320932/getting-error-securityerror-dom-exception-18-the-operation-is-insecure-when
      if (document.readyState === 'complete') {
        setLanguage()
      } else {
        document.onreadystatechange = () => {
          if (document.readyState === 'complete') {
            setLanguage()
          }
        };
      }

      // Don't remove
      true;
    `)

    if (isFirstLoad) {
      setIsFirstLoad(false)
    }
  }, [webViewRef, language, isFirstLoad])
}
