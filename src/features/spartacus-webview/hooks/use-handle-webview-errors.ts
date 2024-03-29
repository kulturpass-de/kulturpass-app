import { useCallback, useEffect, useState } from 'react'
import { Platform } from 'react-native'
import { WebViewErrorEvent, WebViewHttpErrorEvent } from 'react-native-webview/lib/WebViewTypes'
import { logger } from '../../../services/logger'
import { ERR_NO_INTERNET, ERR_UNKNOWN } from '../components/webview-error-view'
import { BridgeAdapterAPI } from '../services/webview-bridge-adapter/create-bridge-adapter-api'

export const useHandleWebviewErrors = (bridgeAdapterApi: BridgeAdapterAPI) => {
  const [errorCode, setErrorCode] = useState<number | typeof ERR_NO_INTERNET | typeof ERR_UNKNOWN | undefined>()

  const handleError = useCallback((event: WebViewErrorEvent) => {
    const { code, description } = event.nativeEvent
    logger.log(`WebView errored with code ${code} - ${description}`)

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
    logger.log(`WebView errored with http code ${statusCode} - ${description}`)
    setErrorCode(event.nativeEvent.statusCode)
  }, [])

  const resetError = useCallback(() => setErrorCode(undefined), [])

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return
    }

    const subscription = bridgeAdapterApi.onMobileAppEvents(event => {
      if (event.type !== 'ANDROID_ERROR') {
        return
      }

      if (errorCode === undefined) {
        setErrorCode(event.data)
      }
    })

    return subscription.unsubscribe
  }, [bridgeAdapterApi, errorCode])

  return { errorCode, handleError, handleHttpError, resetError }
}
