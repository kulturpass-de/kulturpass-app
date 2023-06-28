import { createBridgeAdapterApi } from '../../../../features/spartacus-webview/services/webview-bridge-adapter/create-bridge-adapter-api'
import { WebViewId } from '../../../../features/spartacus-webview/services/webview-bridge-adapter/types'
import { webViewBridgeAdapter } from '../../../../features/spartacus-webview/services/webview-bridge-adapter/webview-bridge-adapter'
import { getCdcSessionData, getCommerceSessionData, getIsUserLoggedIn } from '../../../auth/store/auth-selectors'
import { authCommerceRefreshSession } from '../../../auth/store/thunks/auth-commerce-refresh-session'
import { createThunk } from '../../../redux/utils/create-thunk'
import { selectWebViewState, webviewsSlice } from '../webviews-slice'

export const webviewsValidateSession = createThunk<void, WebViewId>(
  'webviews/validateSession',
  async (payload, thunkAPI) => {
    const state = thunkAPI.getState()

    const webViewId = payload
    const webViewState = selectWebViewState(state, webViewId)
    const isUserLoggedIn = getIsUserLoggedIn(state)
    const cdcSessionData = getCdcSessionData(state)
    const commerceSessionData = getCommerceSessionData(state)

    if (!webViewState.isReady) {
      return
    }

    const bridgeAdapterApi = createBridgeAdapterApi(webViewBridgeAdapter, webViewId)

    const haveDifferentTokens = webViewState.lastAccessToken !== commerceSessionData?.access_token
    const isTokenValid =
      (commerceSessionData?.token_valid_until && commerceSessionData?.token_valid_until > Date.now()) || false
    const shouldReauthenticateWebView =
      (!webViewState.isLoggedIn && isUserLoggedIn) || haveDifferentTokens || !isTokenValid
    const shouldLogoutWebView = webViewState.isLoggedIn && !isUserLoggedIn

    if (shouldReauthenticateWebView) {
      if (isTokenValid && commerceSessionData?.access_token) {
        await bridgeAdapterApi.authLogin(commerceSessionData.access_token)
        thunkAPI.dispatch(
          webviewsSlice.actions.setWebViewState({
            webViewId,
            state: { lastAccessToken: commerceSessionData.access_token },
          }),
        )
      } else if (cdcSessionData) {
        await thunkAPI.dispatch(authCommerceRefreshSession(cdcSessionData)).unwrap()
      }
    } else if (shouldLogoutWebView) {
      await bridgeAdapterApi.authLogout()
    }
  },
)
