import { RefObject, useEffect } from 'react'
import WebView from 'react-native-webview'

export const useWebViewLanguageSync = (webViewRef: RefObject<WebView<{}> | null>, language: string) => {
  useEffect(() => {
    // This is intentionally wrapped. Don't remove it
    const languageWrappedWithQuotationMarks = `"${language}"`

    webViewRef.current?.injectJavaScript(`
      function setLanguageIfNotAlreadySet() {
        const currentLanguage = localStorage.getItem("spartacus⚿⚿language");
        if (currentLanguage !== '${languageWrappedWithQuotationMarks}') {
          localStorage.setItem("spartacus⚿⚿language", '${languageWrappedWithQuotationMarks}');
          location.reload();
        }
      }

      // Without this, we get the warning from webkit:
      // "The operation is insecure."
      // See: https://stackoverflow.com/questions/43320932/getting-error-securityerror-dom-exception-18-the-operation-is-insecure-when
      if (document.readyState === 'complete') {
        setLanguageIfNotAlreadySet()
      } else {
        document.onreadystatechange = () => {
          if (document.readyState === 'complete') {
            setLanguageIfNotAlreadySet()
          }
        };
      }

      // Don't remove
      true;
    `)
  }, [webViewRef, language])
}
