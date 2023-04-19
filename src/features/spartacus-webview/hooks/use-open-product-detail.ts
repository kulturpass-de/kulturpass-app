import { useEffect } from 'react'
import throttle from 'lodash.throttle'

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

        if (url.startsWith('/product/')) {
          const productCode = url.split('/')[2]
          modalNavigation.navigate({
            screen: ProductDetailRouteConfig.name,
            params: {
              productCode: productCode,
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
