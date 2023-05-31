import { useEffect } from 'react'

import { getCurrentUserLocation } from '../../../../services/location/redux/location-selectors'
import { createBridgeAdapterApi } from './create-bridge-adapter-api'
import { WebViewBridgeAdapterState } from './use-webview-bridge-adapter'

export const useWebViewLocationSync = (
  bridgeAdapterApi: ReturnType<typeof createBridgeAdapterApi>,
  bridgeAdapterState: WebViewBridgeAdapterState,
  userLocationState: ReturnType<typeof getCurrentUserLocation>,
) => {
  useEffect(() => {
    if (bridgeAdapterState.isReady) {
      if (userLocationState) {
        bridgeAdapterApi.geolocationSetLocation(userLocationState.coords.latitude, userLocationState.coords.longitude)
      } else {
        bridgeAdapterApi.geolocationSetLocation()
      }
    }
  }, [userLocationState, bridgeAdapterApi, bridgeAdapterState])
}
