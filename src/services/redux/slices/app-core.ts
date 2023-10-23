import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../configure-store'
import { AppConfig, AppCoreState } from '../versions/current'

export const initialState: AppCoreState = {}

export const appCoreSlice = createSlice({
  name: 'appCore',
  initialState,
  reducers: {
    setAppConfig: (state, action: PayloadAction<AppConfig>) => {
      state.appConfig = action.payload
    },
    setIsBootstrapped: state => {
      state.isBootstrapped = true
    },
    setIsInForeground: (state, action: PayloadAction<boolean>) => {
      state.isInForeground = action.payload
    },
    setLastUsedTranslationLanguage: (state, { payload: language }: PayloadAction<string>) => {
      state.lastUsedTranslationLanguage = language
    },
  },
})

const selectAppCoreState = (state: RootState) => state.persisted.appCore

export const selectAppConfig = createSelector(selectAppCoreState, appCoreState => appCoreState.appConfig)
export const selectIsBootstrapped = createSelector(selectAppCoreState, appCoreState => appCoreState.isBootstrapped)
export const selectIsInForeground = createSelector(selectAppCoreState, appCoreState => appCoreState.isInForeground)
export const selectLastUsedTranslationLanguage = createSelector(
  selectAppCoreState,
  appCoreState => appCoreState.lastUsedTranslationLanguage,
)
