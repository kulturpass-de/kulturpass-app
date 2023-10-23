import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../configure-store'

export type AppCoreState = {
  isInForeground?: boolean
  isStoreRehydrated?: boolean
}

export const initialState: AppCoreState = {}

export const appCoreSlice = createSlice({
  name: 'appCore',
  initialState,
  reducers: {
    setIsInForeground: (state, action: PayloadAction<boolean>) => {
      state.isInForeground = action.payload
    },
    setIsStoreRehydrated: (state, action: PayloadAction<boolean>) => {
      state.isStoreRehydrated = action.payload
    },
  },
})

const selectAppCoreState = (state: RootState) => state.appCore

export const selectIsInForeground = createSelector(selectAppCoreState, appCoreState => appCoreState.isInForeground)

export const selectIsStoreRehydrated = createSelector(
  selectAppCoreState,
  appCoreState => appCoreState.isStoreRehydrated,
)
