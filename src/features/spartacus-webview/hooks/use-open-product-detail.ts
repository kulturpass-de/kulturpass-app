import throttle from 'lodash.throttle'
import { useEffect } from 'react'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { ProductDetailRouteConfig } from '../../product-detail/screens/product-detail-route'
import { BridgeAdapterAPI } from '../services/webview-bridge-adapter/create-bridge-adapter-api'
import { SpartacusBridge } from '../services/webview-bridge-adapter/spartacus-bridge'

export const useOpenProductDetail = (bridgeAdapterApi: BridgeAdapterAPI) => {
  const modalNavigation = useModalNavigation()

  useEffect(() => {
    const throttledDataHandler = throttle(
      (data: SpartacusBridge.EventForwarding.RouterEvent['data']) => {
        const url = data.url

        const productCode = url.match(/\/product\/([^?/]+)/)?.[1]

        const isRandomMode = url.includes('randomMode=true')

        if (productCode) {
          modalNavigation.navigate({
            screen: ProductDetailRouteConfig.name,
            params: {
              productCode: productCode,
              randomMode: isRandomMode,
            },
          })
        }
      },
      1000,
      {
        leading: true,
        trailing: false,
      },
    )
    const subscription = bridgeAdapterApi.onRouterEvents(event => throttledDataHandler(event.data))

    return () => subscription.unsubscribe()
  }, [bridgeAdapterApi, modalNavigation])
}
