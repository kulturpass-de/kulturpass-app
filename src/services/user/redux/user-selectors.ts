import { createSelector } from '@reduxjs/toolkit'
import { type RootState } from '../../redux/configure-store'

export const getUserDeniedLocationServices = (state: RootState) => state.user.userDeniedLocationServices
export const selectUserState = (state: RootState) => state.user
export const selectUserPreferences = createSelector(selectUserState, userState => userState.data)
