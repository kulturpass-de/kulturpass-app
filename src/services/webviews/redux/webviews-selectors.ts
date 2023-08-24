import { createSelector } from '@reduxjs/toolkit'
import { WebViewId } from '../../../features/spartacus-webview/services/webview-bridge-adapter/types'
import {
  getCdcSessionData,
  getIsUserLoggedIn,
  getIsUserLoggedInToCdc,
  selectValidCommerceAccessToken,
} from '../../auth/store/auth-selectors'
import { RootState } from '../../redux/configure-store'

const selectWebviewsState = (state: RootState) => state.webviews

export const selectWebViewState = createSelector(
  [selectWebviewsState, (state, webViewId: WebViewId) => webViewId],
  (webviewsState, webViewId) => webviewsState[webViewId],
)

export const selectWebViewAuthSyncAction = createSelector(
  [selectWebViewState, getIsUserLoggedIn, getIsUserLoggedInToCdc, getCdcSessionData, selectValidCommerceAccessToken],
  (webViewState, isUserLoggedIn, isUserLoggedInToCdc, cdcSessionData, validCommerceAccessToken) => {
    if (!webViewState.isReady) {
      return
    }

    const isTokenDifferent = webViewState.lastAccessToken !== validCommerceAccessToken

    const isLoggedInStateDifferent = !webViewState.isLoggedIn && isUserLoggedIn

    if ((isLoggedInStateDifferent || isTokenDifferent) && validCommerceAccessToken && isUserLoggedIn) {
      return { action: 'webviewsAuthLogin', validCommerceAccessToken } as const
    }

    if (
      (isLoggedInStateDifferent || isTokenDifferent) &&
      !validCommerceAccessToken &&
      cdcSessionData &&
      isUserLoggedInToCdc
    ) {
      return { action: 'authCommerceRefreshSession', cdcSessionData } as const
    }

    const shouldLogoutWebView = webViewState.isLoggedIn && !isUserLoggedIn

    if (shouldLogoutWebView) {
      return { action: 'webviewsAuthLogout' } as const
    }
  },
)
