import { Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import Geolocation, { GeoPosition, PositionError } from 'react-native-geolocation-service'
import { check, PERMISSIONS, RESULTS, request, PermissionStatus } from 'react-native-permissions'
import { logger } from '../../services/logger'

const createLocationService = () => {
  return {
    async requestLocationPermission(): Promise<PermissionStatus> {
      if ((await this.checkLocationPermission()) === RESULTS.GRANTED) {
        return RESULTS.GRANTED
      }
      let permissionStatus: PermissionStatus
      if (Platform.OS === 'ios') {
        permissionStatus = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
      } else if (Platform.OS === 'android') {
        permissionStatus = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
      } else {
        console.error('Platform not supported')
        return RESULTS.UNAVAILABLE
      }

      if (permissionStatus !== RESULTS.GRANTED) {
        logger.log('Location Permission not granted')
      }

      return permissionStatus
    },
    async checkLocationPermission(): Promise<PermissionStatus> {
      if (Platform.OS === 'ios') {
        return await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
      } else if (Platform.OS === 'android') {
        return await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
      } else {
        console.error('Platform not supported')
        return RESULTS.UNAVAILABLE
      }
    },
    async getCurrentLocation(): Promise<GeoPosition | undefined> {
      if ((await DeviceInfo.isLocationEnabled()) && (await this.checkLocationPermission()) === RESULTS.GRANTED) {
        return new Promise((res, rej) => {
          Geolocation.getCurrentPosition(res, rej, { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 })
        })
      } else {
        throw new Error(`No permission to fetch location data. Error code: ${PositionError.PERMISSION_DENIED}`)
      }
    },
  }
}

export const locationService = createLocationService()
