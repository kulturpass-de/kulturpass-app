import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../configure-store'
import { AppConfig, PersistedAppCoreState } from '../versions/current'

export const initialState: PersistedAppCoreState = {}

export const persistedAppCoreSlice = createSlice({
  name: 'persistedAppCore',
  initialState,
  reducers: {
    setAppConfig: (state, action: PayloadAction<AppConfig>) => {
      state.appConfig = action.payload
    },
    setIsBootstrapped: state => {
      state.isBootstrapped = true
    },
    setLastUsedTranslationLanguage: (state, { payload: language }: PayloadAction<string>) => {
      state.lastUsedTranslationLanguage = language
    },
  },
})

const selectPersistedAppCoreState = (state: RootState) => state.persisted.persistedAppCore

export const selectAppConfig = createSelector(
  selectPersistedAppCoreState,
  persistedAppCoreState => persistedAppCoreState.appConfig,
)
export const selectIsBootstrapped = createSelector(
  selectPersistedAppCoreState,
  persistedAppCoreState => persistedAppCoreState.isBootstrapped,
)
export const selectLastUsedTranslationLanguage = createSelector(
  selectPersistedAppCoreState,
  persistedAppCoreState => persistedAppCoreState.lastUsedTranslationLanguage,
)

export const selectTcTokenUrlSubdomains = createSelector(
  selectPersistedAppCoreState,
  persistedAppCoreState => persistedAppCoreState.appConfig?.eid.tcTokenUrlSubdomains,
)

export const selectIdentificationDisabled = createSelector(
  selectPersistedAppCoreState,
  persistedAppCoreState => persistedAppCoreState.appConfig?.disableIdentification === true,
)

export const selectBudgetVoucherEnabled = createSelector(
  selectPersistedAppCoreState,
  persistedAppCoreState => persistedAppCoreState.appConfig?.enableBudgetVoucher === true,
)
