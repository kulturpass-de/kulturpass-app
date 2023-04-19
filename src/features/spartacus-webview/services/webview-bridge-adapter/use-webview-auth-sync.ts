import { useEffect, useState } from 'react'

import { getCommerceAccessToken } from '../../../../services/auth/store/auth-selectors'
import { createBridgeAdapterApi } from './create-bridge-adapter-api'
import { WebViewBridgeAdapterState } from './use-webview-bridge-adapter'

export const useWebViewAuthSync = (
  bridgeAdapterApi: ReturnType<typeof createBridgeAdapterApi>,
  bridgeAdapterState: WebViewBridgeAdapterState,
  authApiState: ReturnType<typeof getCommerceAccessToken>,
) => {
  const [webViewAuthState, setWebViewAuthState] = useState<{ isLoggedIn?: boolean }>({})

  useEffect(() => {
    if (!bridgeAdapterState.isReady) {
      return
    }

    if (!webViewAuthState.isLoggedIn && authApiState.isUserLoggedIn && authApiState.commerceAccessToken) {
      bridgeAdapterApi.authLogin(authApiState.commerceAccessToken)
    } else if (webViewAuthState.isLoggedIn && !authApiState.isUserLoggedIn) {
      bridgeAdapterApi.authLogout()
    }
  }, [bridgeAdapterApi, bridgeAdapterState, webViewAuthState, authApiState])

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
