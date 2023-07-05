import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../services/redux/configure-store'
import { webviewsSlice } from '../../../services/webviews/redux/webviews-slice'
import { BridgeAdapterAPI } from '../services/webview-bridge-adapter/create-bridge-adapter-api'
import { SpartacusBridge } from '../services/webview-bridge-adapter/spartacus-bridge'
import { WebViewId } from '../services/webview-bridge-adapter/types'

/**
 * home tab: if the web view encounters a navigation to the search tab,
 * a navigation to the home tab is triggered instead via the bridge
 *
 * search tab: if the web view encounters a navigation to the home tab,
 * a navigation to the search tab is triggered instead via the bridge
 */
export const useHandleWebviewNavigation = (webViewId: WebViewId, bridgeAdapterApi: BridgeAdapterAPI) => {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const navigationHandler = (data: SpartacusBridge.EventForwarding.RouterEvent['data']) => {
      const { url } = data

      dispatch(webviewsSlice.actions.setWebViewState({ webViewId, state: { routerUrl: url } }))

      if (url.startsWith('/search') && webViewId === WebViewId.Home) {
        bridgeAdapterApi.routerNavigate(['/'])
      } else if (url === '/' && webViewId === WebViewId.Search) {
        bridgeAdapterApi.routerNavigate(['/search'])
      }
    }

    const subscription = bridgeAdapterApi.onRouterEvents(event => navigationHandler(event.data))

    return () => subscription.unsubscribe()
  }, [dispatch, webViewId, bridgeAdapterApi])
}
