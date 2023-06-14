import { useEffect, useRef, useState } from 'react'

import { authLogoutWithoutErrors } from '../../../../services/auth/store/thunks/auth-logout'
import { AppDispatch } from '../../../../services/redux/configure-store'
import { createBridgeAdapterApi } from './create-bridge-adapter-api'
import { WebViewBridgeAdapterState } from './use-webview-bridge-adapter'

const STATE_CHANGES_WITHIN_5_SECONDS = 5000

export const useWebViewAuthSync = (
  bridgeAdapterApi: ReturnType<typeof createBridgeAdapterApi>,
  bridgeAdapterState: WebViewBridgeAdapterState,
  dispatch: AppDispatch,
  isUserLoggedIn?: boolean,
  commerceAccessToken?: string,
) => {
  const [webViewAuthState, setWebViewAuthState] = useState<{ isLoggedIn?: boolean }>({})

  const lastLoggedInTimestamp = useRef<number>()

  useEffect(() => {
    const now = Date.now()

    if (!webViewAuthState.isLoggedIn && lastLoggedInTimestamp.current) {
      const diff = now - lastLoggedInTimestamp.current
      if (diff < STATE_CHANGES_WITHIN_5_SECONDS) {
        lastLoggedInTimestamp.current = undefined
        dispatch(authLogoutWithoutErrors()).unwrap()
      }
    }

    if (webViewAuthState.isLoggedIn) {
      lastLoggedInTimestamp.current = now
    }
  }, [webViewAuthState.isLoggedIn, dispatch])

  useEffect(() => {
    if (!bridgeAdapterState.isReady) {
      return
    }

    const reauthenticate = async () => {
      const shouldReauthenticateWebView = !webViewAuthState.isLoggedIn && isUserLoggedIn

      const shouldLogoutWebView = webViewAuthState.isLoggedIn && !isUserLoggedIn

      if (shouldReauthenticateWebView && commerceAccessToken) {
        bridgeAdapterApi.authLogin(commerceAccessToken)
      } else if (shouldLogoutWebView) {
        bridgeAdapterApi.authLogout()
      }
    }

    reauthenticate()
  }, [bridgeAdapterApi, bridgeAdapterState, webViewAuthState, isUserLoggedIn, commerceAccessToken, dispatch])

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
