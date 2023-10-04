import { getCurrentUserLocation } from '../../location/redux/location-selectors'
import { RootState } from '../../redux/configure-store'
import { selectUserPreferences, UserLocationProvider } from '../../user/redux/user-selectors'

export const appendLocationParameters = <InputData extends {}>(
  inputData: InputData,
  rootState: RootState,
  location?: UserLocationProvider,
) => {
  const currentUserLocation = getCurrentUserLocation(rootState)
  const preferredPostalCode = selectUserPreferences(rootState)?.preferredPostalCode

  const data: InputData & { userLocation?: string; postalCode?: string } = { ...inputData }

  if (location) {
    if (location.provider === 'location' && currentUserLocation) {
      data.userLocation = [currentUserLocation.coords.latitude, currentUserLocation.coords.longitude].join(',')
      return data
    }

    if (location.provider === 'postalCode') {
      data.postalCode = location.postalCode
    } else if (location.provider === 'city') {
      data.userLocation = location.location?.coordinates?.join(',')
    }

    return data
  }

  if (currentUserLocation) {
    data.userLocation = [currentUserLocation.coords.latitude, currentUserLocation.coords.longitude].join(',')
  } else if (preferredPostalCode) {
    data.postalCode = preferredPostalCode
  }

  return data
}
