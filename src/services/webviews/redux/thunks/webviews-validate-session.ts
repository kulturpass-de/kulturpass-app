import { WebViewId } from '../../../../features/spartacus-webview/services/webview-bridge-adapter/types'
import { authCommerceRefreshSession } from '../../../auth/store/thunks/auth-commerce-refresh-session'
import { createThunk } from '../../../redux/utils/create-thunk'
import { selectWebViewAuthSyncAction } from '../webviews-selectors'
import { webviewsAuthLogin } from './webviews-auth-login'
import { webviewsAuthLogout } from './webviews-auth-logout'

export const webviewsValidateSession = createThunk<void, WebViewId>(
  'webviews/validateSession',
  async (webViewId, thunkAPI) => {
    const state = thunkAPI.getState()

    const webViewAuthSyncAction = selectWebViewAuthSyncAction(state, webViewId)

    if (webViewAuthSyncAction?.action === 'webviewsAuthLogin') {
      const { validCommerceAccessToken } = webViewAuthSyncAction
      await thunkAPI.dispatch(webviewsAuthLogin({ webViewId, access_token: validCommerceAccessToken })).unwrap()
    } else if (webViewAuthSyncAction?.action === 'authCommerceRefreshSession') {
      await thunkAPI.dispatch(authCommerceRefreshSession(webViewAuthSyncAction.cdcSessionData)).unwrap()
    } else if (webViewAuthSyncAction?.action === 'webviewsAuthLogout') {
      await thunkAPI.dispatch(webviewsAuthLogout({ webViewId })).unwrap()
    }
  },
)
