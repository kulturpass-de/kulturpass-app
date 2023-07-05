import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { getCurrentUserLocation } from '../../../../services/location/redux/location-selectors'
import { selectWebViewState } from '../../../../services/webviews/redux/webviews-selectors'
import { createBridgeAdapterApi } from './create-bridge-adapter-api'
import { WebViewId } from './types'

export const useWebViewLocationSync = (
  webViewId: WebViewId,
  bridgeAdapterApi: ReturnType<typeof createBridgeAdapterApi>,
  userLocationState: ReturnType<typeof getCurrentUserLocation>,
) => {
  const webViewState = useSelector(state => selectWebViewState(state, webViewId))

  useEffect(() => {
    if (webViewState.isReady) {
      if (userLocationState) {
        bridgeAdapterApi.geolocationSetLocation(userLocationState.coords.latitude, userLocationState.coords.longitude)
      } else {
        bridgeAdapterApi.geolocationSetLocation()
      }
    }
  }, [userLocationState, bridgeAdapterApi, webViewState])
}
