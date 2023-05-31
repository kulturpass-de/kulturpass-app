import { GeoPosition } from 'react-native-geolocation-service'

import { commerceApi } from '../../../api/commerce-api'
import { createThunk } from '../../../redux/utils/create-thunk'
import { locationService } from '../../location-service'
import { getCurrentUserLocation } from '../location-selectors'
import { setCurrentUserLocation } from '../location-slice'

export const refreshLocation = createThunk('location/refreshLocation', async (_payload, thunkAPI) => {
  const oldLocation = getCurrentUserLocation(thunkAPI.getState())
  let currentLocation: GeoPosition | undefined

  try {
    currentLocation = await locationService.getCurrentLocation()
  } catch (error) {}

  thunkAPI.dispatch(setCurrentUserLocation(currentLocation))

  const permissionsChanged = (!oldLocation && !!currentLocation) || (!!oldLocation && !currentLocation)

  if (permissionsChanged) {
    thunkAPI.dispatch(commerceApi.util.invalidateTags(['favorites', 'product-detail']))
  }
})
