import { useEffect } from 'react'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { useRequestLocationPopup } from '../../location-sharing/hooks/use-location-popup'
import { BridgeAdapterAPI } from '../services/webview-bridge-adapter/create-bridge-adapter-api'

export const useOpenLocationSharing = (bridgeAdapterApi: BridgeAdapterAPI) => {
  const modalNavigation = useModalNavigation()
  const openRequestLocationPopup = useRequestLocationPopup()

  useEffect(() => {
    const subscription = bridgeAdapterApi.onSearch(event => {
      if (event.name === 'locationOpen') {
        openRequestLocationPopup()
      }
    })

    return () => subscription.unsubscribe()
  }, [bridgeAdapterApi, modalNavigation, openRequestLocationPopup])
}
