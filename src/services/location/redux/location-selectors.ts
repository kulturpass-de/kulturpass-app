import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '../../redux/configure-store'

export const getLocationState = (state: RootState) => state.persisted.location

export const getCurrentUserLocation = createSelector(
  getLocationState,
  locationState => locationState.currentUserLocation,
)
