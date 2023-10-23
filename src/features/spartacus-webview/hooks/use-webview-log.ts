import { RefObject, useEffect } from 'react'
import WebView from 'react-native-webview'
import { z } from 'zod'
import { env } from '../../../env'
import { logger } from '../../../services/logger'
import { injectionService } from '../../../services/webviews/injection-service'
import { BridgeAdapterAPI } from '../services/webview-bridge-adapter/create-bridge-adapter-api'

export const ConsoleSchema = z
  .object({
    type: z.literal('CONSOLE'),
    data: z.object({
      type: z.enum(['log', 'debug', 'info', 'warn', 'error']),
      log: z.array(z.unknown()),
    }),
  })
  .required()

export const useWebViewLog = (webViewRef: RefObject<WebView<{}> | null>, bridgeAdapterApi: BridgeAdapterAPI) => {
  useEffect(() => {
    if (env.DEV_MENU) {
      webViewRef.current?.injectJavaScript(injectionService.webviewDebugging())
    }
  }, [webViewRef])

  useEffect(() => {
    if (!env.DEV_MENU) {
      return
    }

    const subscription = bridgeAdapterApi.onMobileAppEvents(event => {
      if (event.type !== 'CONSOLE') {
        return
      }

      try {
        const { data } = ConsoleSchema.parse(event)
        logger.log('[WEBVIEW]', `[${data.type}]`, ...data.log)
      } catch (error: unknown) {
        logger.warn(`Error while parsing console statement: "${error}".`)
      }
    })

    return subscription.unsubscribe
  }, [bridgeAdapterApi])
}
