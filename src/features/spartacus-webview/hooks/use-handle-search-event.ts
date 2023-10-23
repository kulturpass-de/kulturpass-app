import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { AppDispatch } from '../../../services/redux/configure-store'
import { webviewsSlice } from '../../../services/webviews/redux/webviews-slice'
import { useRequestLocationPopup } from '../../location-sharing/hooks/use-location-popup'
import { BridgeAdapterAPI } from '../services/webview-bridge-adapter/create-bridge-adapter-api'
import { WebViewId } from '../services/webview-bridge-adapter/types'

export const useHandleSearchEvents = (webViewId: WebViewId, bridgeAdapterApi: BridgeAdapterAPI) => {
  const modalNavigation = useModalNavigation()
  const openRequestLocationPopup = useRequestLocationPopup()
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const subscription = bridgeAdapterApi.onSearch(event => {
      if (event.name === 'locationOpen') {
        openRequestLocationPopup()
      } else if (event.name === 'filtersOpen' || event.name === 'sortOpen') {
        dispatch(webviewsSlice.actions.setWebViewState({ webViewId, state: { filtersOrSortOpen: true } }))
      } else if (event.name === 'filtersClose' || event.name === 'sortClose') {
        dispatch(webviewsSlice.actions.setWebViewState({ webViewId, state: { filtersOrSortOpen: false } }))
      }
    })

    return () => subscription.unsubscribe()
  }, [bridgeAdapterApi, dispatch, modalNavigation, openRequestLocationPopup, webViewId])
}
