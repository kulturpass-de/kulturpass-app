import { WebViewId } from '../../../../features/spartacus-webview/services/webview-bridge-adapter/types'
import { logger } from '../../../logger'
import { AppStartListening, ListenerEffect, ListenerPredicate } from '../../../redux/listener-middleware'
import { webviewsValidateSession } from '../thunks/webviews-validate-session'

export const onCommerceAccessTokenChangePredicate: ListenerPredicate = (action, currentState, previousState) => {
  const didCdcIdTokenChange: boolean =
    previousState.auth.commerce?.access_token !== currentState.auth.commerce?.access_token

  return didCdcIdTokenChange
}

export const onCommerceAccessTokenChangeEffect: ListenerEffect = async (action, listenerApi) => {
  const promises = Object.values(WebViewId).map(async webViewId => {
    logger.log('onCommerceAccessTokenChangeEffect', webViewId, 'will call webviewsValidateSession')

    try {
      await listenerApi.dispatch(webviewsValidateSession(webViewId)).unwrap()
    } catch (error: unknown) {
      logger.logError('onCommerceAccessTokenChangeEffect webviewsValidateSession', error)
    }
  })

  await Promise.all(promises)
}

export const onCommerceAccessTokenChange = (startListening: AppStartListening) =>
  startListening({ predicate: onCommerceAccessTokenChangePredicate, effect: onCommerceAccessTokenChangeEffect })
