import { Platform } from 'react-native'
import { check, PERMISSIONS, RESULTS, request, PermissionStatus } from 'react-native-permissions'
import { LocationService } from './types'
import Geolocation, { GeoPosition } from 'react-native-geolocation-service'

const createLocationService = (): LocationService => {
  return {
    async requestLocationPermission() {
      if (await this.checkLocationPermission()) {
        return true
      }
      let permissionStatus: PermissionStatus
      if (Platform.OS === 'ios') {
        permissionStatus = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
      } else if (Platform.OS === 'android') {
        permissionStatus = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
      } else {
        console.error('Platform not supported')
        return false
      }

      if (permissionStatus !== RESULTS.GRANTED) {
        console.log('Location Permission not granted')
        return false
      }

      return true
    },
    async checkLocationPermission() {
      if (Platform.OS === 'ios') {
        return (await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)) === RESULTS.GRANTED
      } else if (Platform.OS === 'android') {
        return (await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)) === RESULTS.GRANTED
      } else {
        console.error('Platform not supported')
        return false
      }
    },
    async getCurrentLocation(): Promise<GeoPosition | undefined> {
      if (await this.checkLocationPermission()) {
        return new Promise((res, rej) => {
          // TODO: Add correct error codes
          Geolocation.getCurrentPosition(res, rej, { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 })
        })
      } else {
        // TODO: Add correct error code
        throw new Error('No permission to fetch location data')
      }
    },
  }
}

export const locationService = createLocationService()
