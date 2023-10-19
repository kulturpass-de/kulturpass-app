import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../configure-store'

export type AppCoreState = {
  isInForeground?: boolean
  isStoreRehydrated?: boolean
  isAppRendered?: boolean
  isAppStarted?: boolean
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
    setIsAppRendered: (state, action: PayloadAction<boolean>) => {
      state.isAppRendered = action.payload
    },
    setIsAppStarted: (state, action: PayloadAction<boolean>) => {
      state.isAppStarted = action.payload
    },
  },
})

const selectAppCoreState = (state: RootState) => state.appCore

export const selectIsInForeground = createSelector(
  selectAppCoreState,
  appCoreState => appCoreState.isInForeground === true,
)

export const selectIsStoreRehydrated = createSelector(
  selectAppCoreState,
  appCoreState => appCoreState.isStoreRehydrated === true,
)

export const selectIsAppRendered = createSelector(
  selectAppCoreState,
  appCoreState => appCoreState.isAppRendered === true,
)

export const selectIsAppStarted = createSelector(selectAppCoreState, appCoreState => appCoreState.isAppStarted === true)
