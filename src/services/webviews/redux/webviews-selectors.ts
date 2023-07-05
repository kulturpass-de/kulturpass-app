import { createSelector } from '@reduxjs/toolkit'
import { WebViewId } from '../../../features/spartacus-webview/services/webview-bridge-adapter/types'
import { getCdcSessionData, getIsUserLoggedIn, selectValidCommerceAccessToken } from '../../auth/store/auth-selectors'
import { RootState } from '../../redux/configure-store'

const selectWebviewsState = (state: RootState) => state.webviews

export const selectWebViewState = createSelector(
  [selectWebviewsState, (state, webViewId: WebViewId) => webViewId],
  (webviewsState, webViewId) => webviewsState[webViewId],
)

export const selectWebViewAuthSyncAction = createSelector(
  [selectWebViewState, getIsUserLoggedIn, getCdcSessionData, selectValidCommerceAccessToken],
  (webViewState, isUserLoggedIn, cdcSessionData, validCommerceAccessToken) => {
    if (!webViewState.isReady) {
      return
    }

    const haveDifferentTokens = webViewState.lastAccessToken !== validCommerceAccessToken

    const shouldReauthenticateWebView =
      (!webViewState.isLoggedIn && isUserLoggedIn) || haveDifferentTokens || !validCommerceAccessToken

    if (shouldReauthenticateWebView && validCommerceAccessToken) {
      return { action: 'webviewsAuthLogin', validCommerceAccessToken } as const
    }

    if (shouldReauthenticateWebView && !validCommerceAccessToken && cdcSessionData) {
      return { action: 'authCommerceRefreshSession', cdcSessionData } as const
    }

    const shouldLogoutWebView = webViewState.isLoggedIn && !isUserLoggedIn

    if (shouldLogoutWebView) {
      return { action: 'webviewsAuthLogout' } as const
    }
  },
)
