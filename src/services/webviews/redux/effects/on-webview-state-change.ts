import { logger } from '../../../logger'
import { AppStartListening, ListenerEffect } from '../../../redux/listener-middleware'
import { webviewsValidateSession } from '../thunks/webviews-validate-session'
import { webviewsSlice } from '../webviews-slice'

export const onWebViewStateChangeEffect: ListenerEffect<
  ReturnType<typeof webviewsSlice.actions.setWebViewState>
> = async (action, listenerApi) => {
  if (typeof action.payload.state.isLoggedIn !== 'undefined' || typeof action.payload.state.isReady !== 'undefined') {
    logger.log('onWebViewStateChangeEffect', action.payload.webViewId, 'will call webviewsValidateSession')

    return await listenerApi.dispatch(webviewsValidateSession(action.payload.webViewId)).unwrap()
  }
}

export const onWebViewStateChange = (startListening: AppStartListening) =>
  startListening({ matcher: webviewsSlice.actions.setWebViewState.match, effect: onWebViewStateChangeEffect })
