import throttle from 'lodash.throttle'
import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getCdcSessionData, isUserPending } from '../../../../services/auth/store/auth-selectors'
import { useAuth } from '../../../../services/auth/use-auth'
import { useGetAccountInfoLazyQuery } from '../../../../services/user/use-get-account-info-lazy-query'
import { BridgeAdapterAPI } from '../../../spartacus-webview/services/webview-bridge-adapter/create-bridge-adapter-api'
import { SpartacusBridge } from '../../../spartacus-webview/services/webview-bridge-adapter/spartacus-bridge'

const THROTTLE_TIMEOUT_MS = 1000

export const useAccountVerifiedWebViewHandler = (bridgeAdapterApi: BridgeAdapterAPI) => {
  const { isLoading } = useAuth()
  const sessionData = useSelector(getCdcSessionData)
  const isPending = isUserPending(sessionData)
  const regToken = sessionData?.regToken
  const getAccountInfoLazyQuery = useGetAccountInfoLazyQuery()

  const [showAlert, setShowAlert] = useState(false)

  useEffect(() => {
    const throttledDataHandler = throttle(
      async (data: SpartacusBridge.EventForwarding.RouterEvent['data']) => {
        if (isLoading) {
          return
        }

        const url = data.url
        if (url !== '/') {
          return
        }

        if (!isPending) {
          return
        }
        if (!regToken) {
          return
        }
        try {
          const { isVerified } = await getAccountInfoLazyQuery(regToken)
          setShowAlert(isVerified === true)
        } catch (_error: unknown) {}
      },
      THROTTLE_TIMEOUT_MS,
      {
        leading: true,
        trailing: false,
      },
    )
    const subscription = bridgeAdapterApi.onRouterEvents(event => throttledDataHandler(event.data))

    return () => subscription.unsubscribe()
  }, [bridgeAdapterApi, isPending, regToken, getAccountInfoLazyQuery, isLoading])

  const reset = useCallback(() => {
    setShowAlert(false)
  }, [])

  return { showAlert, reset }
}
