import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import throttle from 'lodash.throttle'
import { useEffect } from 'react'
import { RootStackParams } from '../../../navigation/types'
import { ProductDetailRouteConfig } from '../../product-detail/screens/product-detail-route'
import { BridgeAdapterAPI } from '../services/webview-bridge-adapter/create-bridge-adapter-api'
import { SpartacusBridge } from '../services/webview-bridge-adapter/spartacus-bridge'

const OPEN_PRODUCT_DETAIL_THROTTLE_MS = 1000

export const useOpenProductDetail = (bridgeAdapterApi: BridgeAdapterAPI) => {
  const rootNavigation = useNavigation<StackNavigationProp<RootStackParams>>()

  useEffect(() => {
    const throttledDataHandler = throttle(
      (data: SpartacusBridge.EventForwarding.RouterEvent['data']) => {
        const url = data.url

        const productCode = url.match(/\/product\/([^?/]+)/)?.[1]

        const isRandomMode = url.includes('randomMode=true')

        if (productCode) {
          rootNavigation.navigate('PDP', {
            screen: ProductDetailRouteConfig.name,
            params: {
              productCode: productCode,
              randomMode: isRandomMode,
            },
          })
        }
      },
      OPEN_PRODUCT_DETAIL_THROTTLE_MS,
      {
        leading: true,
        trailing: false,
      },
    )
    const subscription = bridgeAdapterApi.onRouterEvents(event => throttledDataHandler(event.data))

    return () => subscription.unsubscribe()
  }, [bridgeAdapterApi, rootNavigation])
}
