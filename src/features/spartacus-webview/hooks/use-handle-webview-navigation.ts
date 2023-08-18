import throttle from 'lodash.throttle'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTabsNavigation } from '../../../navigation/tabs/hooks'
import { SearchRouteName } from '../../../screens/search/search-route'
import { AppDispatch } from '../../../services/redux/configure-store'
import { selectWebViewState } from '../../../services/webviews/redux/webviews-selectors'
import { webviewsSlice } from '../../../services/webviews/redux/webviews-slice'
import { BridgeAdapterAPI, createBridgeAdapterApi } from '../services/webview-bridge-adapter/create-bridge-adapter-api'
import { SpartacusBridge } from '../services/webview-bridge-adapter/spartacus-bridge'
import { WebViewId } from '../services/webview-bridge-adapter/types'
import { useWebViewBridgeAdapterContext } from '../services/webview-bridge-adapter/webview-bridge-adapter-provider'

const ROUTER_EFFECT_THROTTLE_TIME_MS = 1000
/**
 * search tab: if the web view encounters a navigation to the home tab,
 * a navigation to the search tab is triggered instead via the bridge
 * home tab: if the web view encounters a navigation to the search tab,
 * the search screen should be shown and navigate the search webview
 * to the requested url
 */
export const useHandleWebviewNavigation = (webViewId: WebViewId, bridgeAdapterApi: BridgeAdapterAPI) => {
  const dispatch = useDispatch<AppDispatch>()
  const { isReady: searchIsReady } = useSelector(state => selectWebViewState(state, WebViewId.Search))
  const webViewBridgeAdapter = useWebViewBridgeAdapterContext()
  const tabNavigation = useTabsNavigation()

  const searchBridgeAdapterApi = useMemo(() => {
    return createBridgeAdapterApi(webViewBridgeAdapter, WebViewId.Search)
  }, [webViewBridgeAdapter])

  useEffect(() => {
    const throttledHomeNavigation = throttle(
      () => {
        bridgeAdapterApi.routerNavigate(['/search'])
      },
      ROUTER_EFFECT_THROTTLE_TIME_MS,
      {
        leading: true,
        trailing: false,
      },
    )

    const navigationHandler = (data: SpartacusBridge.EventForwarding.RouterEvent['data']) => {
      const { url } = data

      dispatch(webviewsSlice.actions.setWebViewState({ webViewId, state: { routerUrl: url } }))

      if (url.startsWith('/search') && webViewId === WebViewId.Home) {
        if (searchIsReady) {
          tabNavigation.navigate(SearchRouteName)
          searchBridgeAdapterApi.routerNavigate(url)
        } else {
          tabNavigation.navigate(SearchRouteName, { initialNavigationUrl: url })
        }
      } else if (url === '/' && webViewId === WebViewId.Search) {
        throttledHomeNavigation()
      }
    }

    const subscription = bridgeAdapterApi.onRouterEvents(event => navigationHandler(event.data))

    return () => subscription.unsubscribe()
  }, [dispatch, webViewId, bridgeAdapterApi, tabNavigation, searchBridgeAdapterApi, searchIsReady])
}
