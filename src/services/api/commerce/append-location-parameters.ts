import { getCurrentUserLocation } from '../../location/redux/location-selectors'
import { RootState } from '../../redux/configure-store'
import { selectUserPreferences } from '../../user/redux/user-selectors'

export const appendLocationParameters = <InputData extends {}>(inputData: InputData, rootState: RootState) => {
  const currentUserLocation = getCurrentUserLocation(rootState)
  const preferredPostalCode = selectUserPreferences(rootState)?.preferredPostalCode

  const data: InputData & { userLocation?: string; postalCode?: string } = { ...inputData }

  if (currentUserLocation) {
    data.userLocation = [currentUserLocation.coords.latitude, currentUserLocation.coords.longitude].join(',')
  } else if (preferredPostalCode) {
    data.postalCode = preferredPostalCode
  }

  return data
}
