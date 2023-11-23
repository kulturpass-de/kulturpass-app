import { GeoPosition } from 'react-native-geolocation-service'
import { logger } from '../../../../services/logger'
import { commerceApi } from '../../../api/commerce-api'
import { createThunk } from '../../../redux/utils/create-thunk'
import { clearUserLocation, persistUserLocation } from '../../../session/session-service'
import { getUserDeniedLocationServices } from '../../../user/redux/user-selectors'
import { locationService } from '../../location-service'
import { getCurrentUserLocation } from '../location-selectors'
import { setCurrentUserLocation } from '../location-slice'

export const refreshLocation = createThunk('location/refreshLocation', async (_payload, thunkAPI) => {
  const oldLocation = getCurrentUserLocation(thunkAPI.getState())
  const userDeniedLocationServices = getUserDeniedLocationServices(thunkAPI.getState())
  let currentLocation: GeoPosition | undefined

  try {
    // allow request once every app session. restart resets the flag
    if (!userDeniedLocationServices) {
      currentLocation = await locationService.getCurrentLocation()
    }
  } catch (error: unknown) {
    logger.log('Failed to get current location:', error)
  }

  thunkAPI.dispatch(setCurrentUserLocation(currentLocation))
  // Store user location in secure storage as well
  if (currentLocation) {
    await persistUserLocation(currentLocation)
  } else {
    await clearUserLocation()
  }

  const permissionsChanged = (!oldLocation && !!currentLocation) || (!!oldLocation && !currentLocation)

  if (permissionsChanged) {
    thunkAPI.dispatch(commerceApi.util.invalidateTags(['favorites', 'product-detail']))
  }
})
