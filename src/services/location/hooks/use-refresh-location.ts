import { useCallback } from 'react'
import { store } from '../../../app'
import { setCurrentUserLocation } from '../redux/location-slice'
import { locationService } from '../location-service'

export const useRefreshLocation = () => {
  const refreshLocation = useCallback(async () => {
    try {
      const currentLocation = await locationService.getCurrentLocation()
      console.log(
        `Location Refresh => latitude: ${currentLocation?.coords.latitude} - longitude: ${currentLocation?.coords.longitude}`,
      )
      store.dispatch(setCurrentUserLocation(currentLocation))
    } catch (error) {
      // TODO: Add correct error handling
      console.log(error)
    }
  }, [])

  return {
    refreshLocation,
  }
}
