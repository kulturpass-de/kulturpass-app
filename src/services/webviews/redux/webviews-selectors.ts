import { createSelector } from '@reduxjs/toolkit'
import { WebViewId } from '../../../features/spartacus-webview/services/webview-bridge-adapter/types'
import { getCdcSessionData, getCommerceSessionData } from '../../auth/store/auth-selectors'
import { isUserLoggedInToCdc, isUserLoggedInToCommerce } from '../../auth/store/utils'
import { RootState } from '../../redux/configure-store'

const selectWebviewsState = (state: RootState) => state.webviews

export const selectWebViewState = createSelector(
  [selectWebviewsState, (state, webViewId: WebViewId) => webViewId],
  (webviewsState, webViewId) => webviewsState[webViewId],
)

export const selectHomeHeaderShown = createSelector(
  selectWebviewsState,
  webviewsState => webviewsState[WebViewId.Home].showHeader,
)

export const selectFiltersOrSortOpen = (webViewId: WebViewId) =>
  createSelector(selectWebviewsState, webviewsState => webviewsState[webViewId].filtersOrSortOpen === true)

export const selectWebViewAuthSyncAction = createSelector(
  [selectWebViewState, getCdcSessionData, getCommerceSessionData],
  (webViewState, cdcSessionData, commerceSessionData) => {
    if (!webViewState.isReady) {
      return
    }

    // We do not use selectors, as they are memoized
    const isCommerceSessionValid = isUserLoggedInToCommerce(commerceSessionData)
    const isCdcSessionValid = isUserLoggedInToCdc(cdcSessionData)

    const validCommerceAccessToken = isCommerceSessionValid ? (commerceSessionData?.access_token ?? null) : null

    const isTokenDifferent = webViewState.lastAccessToken !== validCommerceAccessToken

    const isUserLoggedIn = isCommerceSessionValid && isCdcSessionValid

    const isLoggedInStateDifferent = !webViewState.isLoggedIn && isUserLoggedIn

    if ((isLoggedInStateDifferent || isTokenDifferent) && validCommerceAccessToken && isUserLoggedIn) {
      return { action: 'webviewsAuthLogin', validCommerceAccessToken } as const
    }

    if (
      (isLoggedInStateDifferent || isTokenDifferent) &&
      !validCommerceAccessToken &&
      cdcSessionData &&
      isCdcSessionValid
    ) {
      return { action: 'authCommerceRefreshSession', cdcSessionData } as const
    }

    const shouldLogoutWebView = webViewState.isLoggedIn && !isUserLoggedIn

    if (shouldLogoutWebView) {
      return { action: 'webviewsAuthLogout' } as const
    }
  },
)
