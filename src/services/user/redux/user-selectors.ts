import { createSelector } from '@reduxjs/toolkit'
import { getCurrentUserLocation } from '../../location/redux/location-selectors'
import { type RootState } from '../../redux/configure-store'

export const getUserDeniedLocationServices = (state: RootState) => state.user.userDeniedLocationServices
export const getDisplayVerifiedAlert = (state: RootState) => state.user.displayVerifiedAlert
export const selectUserState = (state: RootState) => state.user
export const selectUserPreferences = createSelector(selectUserState, userState => userState.data)

export type UserLocationProvider = { provider: 'location' } | { provider: 'postalCode'; postalCode: string } | undefined

export const selectDefaultLocationProvider = (rootState: RootState): UserLocationProvider => {
  const currentUserLocation = getCurrentUserLocation(rootState)
  const preferredPostalCode = selectUserPreferences(rootState)?.preferredPostalCode

  if (currentUserLocation) {
    return { provider: 'location' }
  }

  if (preferredPostalCode) {
    return { provider: 'postalCode', postalCode: preferredPostalCode }
  }

  return undefined
}
