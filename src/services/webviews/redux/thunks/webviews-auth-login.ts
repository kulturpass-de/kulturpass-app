import { SpartacusBridge } from '../../../../features/spartacus-webview/services/webview-bridge-adapter/spartacus-bridge'
import { WebViewId } from '../../../../features/spartacus-webview/services/webview-bridge-adapter/types'
import { webViewBridgeAdapter } from '../../../../features/spartacus-webview/services/webview-bridge-adapter/webview-bridge-adapter'
import { createThunk } from '../../../redux/utils/create-thunk'
import { webviewsSlice } from '../webviews-slice'

export const webviewsAuthLogin = createThunk<void, { webViewId: WebViewId; access_token: string }>(
  'webviews/authLogin',
  async ({ webViewId, access_token }, thunkAPI) => {
    await webViewBridgeAdapter.callBridgeFunction(webViewId, SpartacusBridge.FunctionCall.Target.AuthLogin, [
      { access_token },
    ])

    thunkAPI.dispatch(webviewsSlice.actions.setWebViewState({ webViewId, state: { lastAccessToken: access_token } }))
  },
)
