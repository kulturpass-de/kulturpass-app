import throttle from 'lodash.throttle'
import { useEffect } from 'react'
import { BridgeAdapterAPI } from '../services/webview-bridge-adapter/create-bridge-adapter-api'
import { useNavigateToPDP } from './use-navigate-to-pdp'

const OPEN_PRODUCT_DETAIL_THROTTLE_MS = 1000

export const useOpenProductDetail = (bridgeAdapterApi: BridgeAdapterAPI) => {
  const navigateToPDP = useNavigateToPDP()

  useEffect(() => {
    const throttledDataHandler = throttle(navigateToPDP, OPEN_PRODUCT_DETAIL_THROTTLE_MS, {
      leading: true,
      trailing: false,
    })
    const subscription = bridgeAdapterApi.onRouterEvents(event => throttledDataHandler(event.data))

    return () => subscription.unsubscribe()
  }, [bridgeAdapterApi, navigateToPDP])
}
