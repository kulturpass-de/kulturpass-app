import { useEffect, useRef, useState } from 'react'
import { PostAuthTokenResponse } from '../../../../services/api/types'

import { getCommerceAccessToken } from '../../../../services/auth/store/auth-selectors'
import { createBridgeAdapterApi } from './create-bridge-adapter-api'
import { WebViewBridgeAdapterState } from './use-webview-bridge-adapter'

const STATE_CHANGES_WITHIN_5_SECONDS = 5000

export type AuthApi = {
  login: () => Promise<PostAuthTokenResponse>
  logout: () => void
}

export const useWebViewAuthSync = (
  bridgeAdapterApi: ReturnType<typeof createBridgeAdapterApi>,
  bridgeAdapterState: WebViewBridgeAdapterState,
  authApiState: ReturnType<typeof getCommerceAccessToken>,
  authApi: AuthApi,
) => {
  const [webViewAuthState, setWebViewAuthState] = useState<{ isLoggedIn?: boolean }>({})

  const lastLoggedInTimestamp = useRef<number>()

  useEffect(() => {
    const now = Date.now()

    if (!webViewAuthState.isLoggedIn && lastLoggedInTimestamp.current) {
      const diff = now - lastLoggedInTimestamp.current
      if (diff < STATE_CHANGES_WITHIN_5_SECONDS) {
        lastLoggedInTimestamp.current = undefined
        authApi.logout()
      }
    }

    if (webViewAuthState.isLoggedIn) {
      lastLoggedInTimestamp.current = now
    }
  }, [webViewAuthState.isLoggedIn, authApi])

  useEffect(() => {
    if (!bridgeAdapterState.isReady) {
      return
    }

    const reauthenticate = async () => {
      const shouldReauthenticateWebView =
        !webViewAuthState.isLoggedIn && authApiState.isUserLoggedInToCommerce && authApiState.commerceAccessToken

      const shouldObtainOAuthTokenToReauthenticateWebView =
        !webViewAuthState.isLoggedIn &&
        !authApiState.isUserLoggedInToCommerce &&
        authApiState.isUserLoggedInToCdc &&
        authApiState.cdc

      const shouldLogoutWebView = webViewAuthState.isLoggedIn && !authApiState.isUserLoggedIn

      if (shouldReauthenticateWebView) {
        bridgeAdapterApi.authLogin(authApiState.commerceAccessToken!)
      } else if (shouldObtainOAuthTokenToReauthenticateWebView) {
        const response = await authApi.login()
        bridgeAdapterApi.authLogin(response.access_token)
      } else if (shouldLogoutWebView) {
        bridgeAdapterApi.authLogout()
      }
    }

    reauthenticate()
  }, [bridgeAdapterApi, bridgeAdapterState, webViewAuthState, authApiState, authApi])

  useEffect(() => {
    const subscription = bridgeAdapterApi.onAuthIsUserLoggedIn(event => {
      setWebViewAuthState(state => ({ ...state, isLoggedIn: event.value === true }))
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [bridgeAdapterApi])

  return webViewAuthState
}
