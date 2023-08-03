import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { getCurrentUserLocation } from '../../../../services/location/redux/location-selectors'
import { selectWebViewState } from '../../../../services/webviews/redux/webviews-selectors'
import { createBridgeAdapterApi } from './create-bridge-adapter-api'
import { WebViewId } from './types'

export type GeolocationState = {
  coords: {
    longitude: number
    latitude: number
  }
}

const PRECISION = 5

const locationHasChanged = (a: GeolocationState, b?: GeolocationState | null): boolean => {
  if (b === null) {
    return true
  }

  return (
    a.coords.latitude.toFixed(PRECISION) !== b?.coords.latitude.toFixed(PRECISION) &&
    a.coords.longitude.toFixed(PRECISION) !== b?.coords.longitude.toFixed(PRECISION)
  )
}

export const useWebViewLocationSync = (
  webViewId: WebViewId,
  bridgeAdapterApi: ReturnType<typeof createBridgeAdapterApi>,
  userLocationState: ReturnType<typeof getCurrentUserLocation>,
) => {
  const webViewState = useSelector(state => selectWebViewState(state, webViewId))
  // unknown geolocation is indicated by undefined. initially null, to set location once and prevent multiple calls
  const previousSubmittedUserLocationState = useRef<null | ReturnType<typeof getCurrentUserLocation>>(null)

  useEffect(() => {
    if (webViewState.isReady) {
      // only call geolocationSetLocation if the location has changed
      if (userLocationState && locationHasChanged(userLocationState, previousSubmittedUserLocationState.current)) {
        bridgeAdapterApi.geolocationSetLocation(userLocationState.coords.latitude, userLocationState.coords.longitude)
      } else if (!userLocationState && previousSubmittedUserLocationState.current !== userLocationState) {
        bridgeAdapterApi.geolocationSetLocation()
      }

      previousSubmittedUserLocationState.current = userLocationState
    }
  }, [userLocationState, bridgeAdapterApi, webViewState])
}
