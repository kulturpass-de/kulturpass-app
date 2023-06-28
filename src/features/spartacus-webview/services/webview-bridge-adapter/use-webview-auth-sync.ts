import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { AppDispatch } from '../../../../services/redux/configure-store'
import { webviewsValidateSession } from '../../../../services/webviews/redux/thunks/webviews-validate-session'
import { webviewsSlice } from '../../../../services/webviews/redux/webviews-slice'
import { createBridgeAdapterApi } from './create-bridge-adapter-api'
import { WebViewId } from './types'

export const useWebViewAuthSync = (
  webViewId: WebViewId,
  bridgeAdapterApi: ReturnType<typeof createBridgeAdapterApi>,
) => {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const subscription = bridgeAdapterApi.onAuthIsUserLoggedIn(event => {
      const isLoggedIn = event.value === true
      dispatch(webviewsSlice.actions.setWebViewState({ webViewId, state: { isLoggedIn } }))
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [bridgeAdapterApi, dispatch, webViewId])

  useEffect(() => {
    const subscription = bridgeAdapterApi.onAuth(async event => {
      if (event.name === 'tokenAwaited') {
        await dispatch(webviewsValidateSession(webViewId)).unwrap()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [bridgeAdapterApi, dispatch, webViewId])
}
