import { Mutex } from 'async-mutex'

import { webViewBridgeAdapter } from '../../../../features/spartacus-webview/services/webview-bridge-adapter/webview-bridge-adapter'
import { AppStartListening, ListenerEffect } from '../../../redux/listener-middleware'
import { selectWebViewState, webviewsSlice } from '../webviews-slice'

const mutex = new Mutex()

export const onWebViewRouteUrlChangeEffect: ListenerEffect<
  ReturnType<typeof webviewsSlice.actions.setWebViewState>
> = async (action, listenerApi) => {
  const { webViewId, state: newWebViewState } = action.payload
  const state = listenerApi.getState()
  const currentWebViewState = selectWebViewState(state, webViewId)

  if (
    newWebViewState.routerUrl === '/login' ||
    (currentWebViewState.routerUrl === '/login' && newWebViewState.isLoggedIn)
  ) {
    await mutex.runExclusive(() => {
      webViewBridgeAdapter.reload(webViewId)
    })
  }
}

export const onWebViewRouteUrlChange = (startListening: AppStartListening) =>
  startListening({ matcher: webviewsSlice.actions.setWebViewState.match, effect: onWebViewRouteUrlChangeEffect })
