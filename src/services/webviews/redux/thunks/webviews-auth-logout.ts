import { SpartacusBridge } from '../../../../features/spartacus-webview/services/webview-bridge-adapter/spartacus-bridge'
import { WebViewId } from '../../../../features/spartacus-webview/services/webview-bridge-adapter/types'
import { webViewBridgeAdapter } from '../../../../features/spartacus-webview/services/webview-bridge-adapter/webview-bridge-adapter'
import { logger } from '../../../logger'
import { createThunk } from '../../../redux/utils/create-thunk'
import { webviewsSlice } from '../webviews-slice'

export const webviewsAuthLogout = createThunk<void, { webViewId: WebViewId }>(
  'webviews/authLogout',
  async ({ webViewId }, thunkAPI) => {
    logger.log('webviewsAuthLogout', webViewId)

    // reset search webview to reset filters, after a user logged out
    if (webViewId === WebViewId.Search) {
      logger.log('webviewsAuthLogout', webViewId, 'reset search web view')

      webViewBridgeAdapter.callBridgeFunction(webViewId, SpartacusBridge.FunctionCall.Target.RouterNavigate, [
        '/search',
      ])
    }

    await webViewBridgeAdapter.callBridgeFunction(webViewId, SpartacusBridge.FunctionCall.Target.AuthLogout, [])

    thunkAPI.dispatch(webviewsSlice.actions.setWebViewState({ webViewId, state: { lastAccessToken: null } }))
  },
)
