import { createSelector } from '@reduxjs/toolkit'
import { type RootState } from '../../redux/configure-store'

export const selectUserState = (state: RootState) => state.user
export const selectUserProfile = createSelector(selectUserState, userState => userState.profile)
export const selectUserPreferences = createSelector(selectUserState, userState => userState.data)
