import { useEffect } from 'react'

import { BridgeAdapterAPI } from '../services/webview-bridge-adapter/create-bridge-adapter-api'
import { SpartacusBridge } from '../services/webview-bridge-adapter/spartacus-bridge'
import { useRoute } from '@react-navigation/native'
import { HomeRouteName } from '../../../screens/home/home-route'
import { SearchRouteName } from '../../../screens/search/search-route'

/**
 * home tab: if the web view encounters a navigation to the search tab,
 * a navigation to the home tab is triggered instead via the bridge
 *
 * search tab: if the web view encounters a navigation to the home tab,
 * a navigation to the search tab is triggered instead via the bridge
 */
export const useHandleWebviewNavigation = (bridgeAdapterApi: BridgeAdapterAPI) => {
  const route = useRoute()

  useEffect(() => {
    const navigationHandler = (data: SpartacusBridge.EventForwarding.RouterEvent['data']) => {
      const { url } = data

      if (url.startsWith('/search') && route.name === HomeRouteName) {
        bridgeAdapterApi.routerNavigate(['/'])
      } else if (url === '/' && route.name === SearchRouteName) {
        bridgeAdapterApi.routerNavigate(['/search'])
      }
    }
    const subscription = bridgeAdapterApi.onRouterEvents(event => navigationHandler(event.data))

    return () => subscription.unsubscribe()
  }, [bridgeAdapterApi, route.name])
}
