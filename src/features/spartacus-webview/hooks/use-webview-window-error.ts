import { RefObject, useEffect } from 'react'
import WebView from 'react-native-webview'
import { z } from 'zod'
import { env } from '../../../env'
import { logger } from '../../../services/logger'
import { injectionService } from '../../../services/webviews/injection-service'
import { BridgeAdapterAPI } from '../services/webview-bridge-adapter/create-bridge-adapter-api'

export const WindowErrorSchema = z
  .object({
    type: z.literal('WINDOW_ERROR'),
    data: z.object({
      message: z.string(),
      error: z.string(),
      sourcefile: z.string(),
      lineno: z.number(),
      colno: z.number(),
    }),
  })
  .required()

export const useWebViewWindowError = (
  webViewRef: RefObject<WebView<{}> | null>,
  bridgeAdapterApi: BridgeAdapterAPI,
) => {
  useEffect(() => {
    if (env.DEV_MENU) {
      webViewRef.current?.injectJavaScript(injectionService.webviewWindowOnError())
    }
  }, [webViewRef])

  useEffect(() => {
    if (!env.DEV_MENU) {
      return
    }

    const subscription = bridgeAdapterApi.onMobileAppEvents(event => {
      if (event.type !== 'WINDOW_ERROR') {
        return
      }

      try {
        const {
          data: { message, error, sourcefile, colno, lineno },
        } = WindowErrorSchema.parse(event)
        console.error('[WEBVIEW] onError:', message, error, `(${sourcefile}:${lineno}:${colno})`)
      } catch (error: unknown) {
        logger.warn(`Error while parsing window error: "${error}". Original data: "${JSON.stringify(event.data)}".`)
      }
    })

    return subscription.unsubscribe
  }, [bridgeAdapterApi])
}
