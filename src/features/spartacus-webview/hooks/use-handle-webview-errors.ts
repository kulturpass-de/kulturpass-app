import { useCallback, useState } from 'react'
import { WebViewErrorEvent, WebViewHttpErrorEvent } from 'react-native-webview/lib/WebViewTypes'
import { ERR_NO_INTERNET } from '../components/webview-error-view'
import { Platform } from 'react-native'

export const useHandleWebviewErrors = () => {
  const [errorCode, setErrorCode] = useState<number | typeof ERR_NO_INTERNET | undefined>()

  const handleError = useCallback((event: WebViewErrorEvent) => {
    const { code, description } = event.nativeEvent
    console.log(`WebView errored with code ${code} - ${description}`)

    // Check no internet error
    if (Platform.OS === 'ios' && code === -1009) {
      // https://developer.apple.com/documentation/foundation/1508628-url_loading_system_error_codes/nsurlerrornotconnectedtointernet
      setErrorCode(ERR_NO_INTERNET)
    } else if (Platform.OS === 'android' && description === 'net::ERR_INTERNET_DISCONNECTED') {
      // https://developer.android.com/guide/topics/connectivity/cronet/reference/org/chromium/net/NetworkException.html#ERROR_INTERNET_DISCONNECTED
      setErrorCode(ERR_NO_INTERNET)
    } else {
      setErrorCode(event.nativeEvent.code)
    }
  }, [])

  const handleHttpError = useCallback((event: WebViewHttpErrorEvent) => {
    const { statusCode, description } = event.nativeEvent
    console.log(`WebView errored with http code ${statusCode} - ${description}`)
    setErrorCode(event.nativeEvent.statusCode)
  }, [])

  const resetError = useCallback(() => setErrorCode(undefined), [])

  return { errorCode, handleError, handleHttpError, resetError }
}