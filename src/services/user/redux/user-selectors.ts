import { createSelector } from '@reduxjs/toolkit'
import { GetProductDetailParams } from '../../api/types'
import { getCurrentUserLocation } from '../../location/redux/location-selectors'
import { type RootState } from '../../redux/configure-store'

export const getUserDeniedLocationServices = (state: RootState) => state.user.userDeniedLocationServices
export const getDisplayVerifiedAlert = (state: RootState) => state.user.displayVerifiedAlert
export const selectUserState = (state: RootState) => state.user
export const selectUserPreferences = createSelector(selectUserState, userState => userState.data)
export const selectUserProfile = createSelector(selectUserState, userState => userState.profile)

export type UserLocationProvider = GetProductDetailParams['location'] | undefined

export const selectDefaultLocationProvider = createSelector(
  (rootState: RootState) => ({
    currentUserLocation: getCurrentUserLocation(rootState),
    preferredPostalCode: selectUserPreferences(rootState)?.preferredPostalCode,
  }),
  ({ currentUserLocation, preferredPostalCode }): UserLocationProvider => {
    if (currentUserLocation) {
      return { provider: 'location' }
    }

    if (preferredPostalCode) {
      return { provider: 'postalCode', postalCode: preferredPostalCode }
    }

    return undefined
  },
)
