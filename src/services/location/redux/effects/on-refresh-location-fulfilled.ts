import { WebViewId } from '../../../../features/spartacus-webview/services/webview-bridge-adapter/types'
import { logger } from '../../../logger'
import { AppStartListening, ListenerEffect, ListenerEffectMatcherAction } from '../../../redux/listener-middleware'
import { webviewsLocationSync } from '../../../webviews/redux/thunks/webviews-location-sync'
import { refreshLocation } from '../thunks/refresh-location'

export const onRefreshLocationFulfilledEffect: ListenerEffect<
  ListenerEffectMatcherAction<(typeof refreshLocation)['fulfilled']['match']>
> = async (_payload, listenerApi) => {
  logger.log('onRefreshLocationFulfilledEffect syncing Location with webview')
  try {
    await listenerApi.dispatch(webviewsLocationSync(WebViewId.Home)).unwrap()
  } catch (error: unknown) {
    logger.logError('onRefreshLocationFulfilledEffect Home', error)
  }

  try {
    await listenerApi.dispatch(webviewsLocationSync(WebViewId.Search)).unwrap()
  } catch (error: unknown) {
    logger.logError('onRefreshLocationFulfilledEffect Search', error)
  }
}

export const onRefreshLocationFulfilled = (startListening: AppStartListening) =>
  startListening({ matcher: refreshLocation.fulfilled.match, effect: onRefreshLocationFulfilledEffect })
