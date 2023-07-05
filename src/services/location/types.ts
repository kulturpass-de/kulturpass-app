import { GeoPosition } from 'react-native-geolocation-service'

export type LocationService = {
  checkLocationPermission(): Promise<boolean>
  requestLocationPermission(): Promise<boolean>
  getCurrentLocation(): Promise<GeoPosition | undefined>
}
