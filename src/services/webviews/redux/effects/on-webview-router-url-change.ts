import { Mutex } from 'async-mutex'
import { webViewBridgeAdapter } from '../../../../features/spartacus-webview/services/webview-bridge-adapter/webview-bridge-adapter'
import { logger } from '../../../logger'
import { AppStartListening, ListenerEffect } from '../../../redux/listener-middleware'
import { selectWebViewState } from '../webviews-selectors'
import { webviewsSlice } from '../webviews-slice'

const mutex = new Mutex()

export const onWebViewRouterUrlChangeEffect: ListenerEffect<
  ReturnType<typeof webviewsSlice.actions.setWebViewState>
> = async (action, listenerApi) => {
  const { webViewId, state: newWebViewState } = action.payload
  const state = listenerApi.getState()
  const currentWebViewState = selectWebViewState(state, webViewId)

  if (
    newWebViewState.routesToLogin === true ||
    (currentWebViewState.routesToLogin === true && newWebViewState.isLoggedIn)
  ) {
    await mutex.runExclusive(() => {
      logger.log('onWebViewRouterUrlChangeEffect', webViewId, ' will call webViewBridgeAdapter.reload')

      webViewBridgeAdapter.reload(webViewId)
    })
  }
}

export const onWebViewRouterUrlChange = (startListening: AppStartListening) =>
  startListening({ matcher: webviewsSlice.actions.setWebViewState.match, effect: onWebViewRouterUrlChangeEffect })
