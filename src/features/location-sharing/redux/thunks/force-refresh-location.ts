import { Platform } from 'react-native'
import { RESULTS } from 'react-native-permissions'
import { locationService } from '../../../../services/location/location-service'
import { refreshLocation } from '../../../../services/location/redux/thunks/refresh-location'
import { logger } from '../../../../services/logger'
import { createThunk } from '../../../../services/redux/utils/create-thunk'
import { userSlice } from '../../../../services/user/redux/user-slice'

export const forceRefreshLocation = createThunk<boolean>(
  'location/forceRefreshLocation',
  async (_payload, thunkAPI) => {
    let locationCheckResult = await locationService.checkLocationPermission()
    logger.log('forceRefreshLocation', locationCheckResult)
    if (locationCheckResult === RESULTS.DENIED && Platform.OS === 'ios') {
      locationCheckResult = await locationService.requestLocationPermission()
      logger.log('forceRefreshLocation permission requested', locationCheckResult)
    }
    if (locationCheckResult === RESULTS.GRANTED) {
      logger.log('forceRefreshLocation permission granted')
      thunkAPI.dispatch(userSlice.actions.setUserDeniedLocationServices(false))
      await thunkAPI.dispatch(refreshLocation()).unwrap()
    }
    return locationCheckResult === RESULTS.GRANTED
  },
)
