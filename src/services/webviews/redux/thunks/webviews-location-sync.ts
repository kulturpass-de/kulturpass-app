import { SpartacusBridge } from '../../../../features/spartacus-webview/services/webview-bridge-adapter/spartacus-bridge'
import { WebViewId } from '../../../../features/spartacus-webview/services/webview-bridge-adapter/types'
import { webViewBridgeAdapter } from '../../../../features/spartacus-webview/services/webview-bridge-adapter/webview-bridge-adapter'
import { getCurrentUserLocation } from '../../../location/redux/location-selectors'
import { logger } from '../../../logger'
import { createThunk } from '../../../redux/utils/create-thunk'
import { GeolocationState, webviewsSlice } from '../webviews-slice'

const PRECISION = 5

const locationHasChanged = (a: GeolocationState, b?: GeolocationState | null): boolean => {
  if (b === null) {
    return true
  }

  return (
    a.latitude.toFixed(PRECISION) !== b?.latitude.toFixed(PRECISION) &&
    a.longitude.toFixed(PRECISION) !== b?.longitude.toFixed(PRECISION)
  )
}

export const webviewsLocationSync = createThunk<void, WebViewId>(
  'webviews/locationSync',
  async (webViewId, thunkAPI) => {
    logger.log('webviewsLocationSync', webViewId)

    const store = thunkAPI.getState()
    const { isReady, previousSubmittedUserLocationState } = store.webviews[webViewId]

    if (isReady) {
      const currentUserLocation = getCurrentUserLocation(store)
      const userLocationState: GeolocationState | undefined = currentUserLocation?.coords

      // only call geolocationSetLocation if the location has changed
      if (userLocationState && locationHasChanged(userLocationState, previousSubmittedUserLocationState)) {
        await webViewBridgeAdapter.callBridgeFunction(
          webViewId,
          SpartacusBridge.FunctionCall.Target.GeolocationSetLocation,
          [userLocationState.latitude, userLocationState.longitude],
        )
      } else if (!userLocationState && previousSubmittedUserLocationState !== userLocationState) {
        await webViewBridgeAdapter.callBridgeFunction(
          webViewId,
          SpartacusBridge.FunctionCall.Target.GeolocationSetLocation,
          [undefined, undefined],
        )
      }
      thunkAPI.dispatch(
        webviewsSlice.actions.setPreviousSubmittedUserLocationWebviewState({
          webViewId,
          location: userLocationState,
        }),
      )
    }
  },
)
