import { useEffect, useState } from 'react'

import { authCommerceRefreshSession } from '../../../../services/auth/store/thunks/auth-commerce-refresh-session'
import { AppDispatch } from '../../../../services/redux/configure-store'
import { CdcSessionData, CommerceSessionData } from '../../../../services/session/types'
import { createBridgeAdapterApi } from './create-bridge-adapter-api'
import { WebViewBridgeAdapterState } from './use-webview-bridge-adapter'

export const useWebViewAuthSync = (
  bridgeAdapterApi: ReturnType<typeof createBridgeAdapterApi>,
  bridgeAdapterState: WebViewBridgeAdapterState,
  dispatch: AppDispatch,
  isUserLoggedIn?: boolean,
  cdcSessionData?: CdcSessionData | null,
  commerceSessionData?: CommerceSessionData | null,
) => {
  const [webViewAuthState, setWebViewAuthState] = useState<{ isLoggedIn?: boolean }>({})

  useEffect(() => {
    if (!bridgeAdapterState.isReady) {
      return
    }

    const reauthenticate = async () => {
      const shouldReauthenticateWebView = !webViewAuthState.isLoggedIn && isUserLoggedIn
      let shouldLogoutWebView = webViewAuthState.isLoggedIn && !isUserLoggedIn

      try {
        if (shouldReauthenticateWebView) {
          const { access_token, token_valid_until } = commerceSessionData!
          if (token_valid_until && token_valid_until > Date.now()) {
            await bridgeAdapterApi.authLogin(access_token)
          } else {
            await dispatch(authCommerceRefreshSession(cdcSessionData!)).unwrap()
          }
        }
      } catch (error) {
        shouldLogoutWebView = true
      }

      if (shouldLogoutWebView) {
        bridgeAdapterApi.authLogout()
      }
    }

    reauthenticate()
  }, [
    bridgeAdapterApi,
    bridgeAdapterState,
    webViewAuthState,
    isUserLoggedIn,
    cdcSessionData,
    commerceSessionData,
    dispatch,
  ])

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
