import AsyncStorage from '@react-native-async-storage/async-storage'
import { combineReducers } from '@reduxjs/toolkit'
import * as ReduxPersist from 'redux-persist'
import { cardSimulationSlice } from '../../features/eid-verification/redux/simulated-card'
import { onboardingSlice } from '../../features/onboarding/redux/onboarding'
import { environmentConfigurationSlice } from '../environment-configuration/redux/environment-configuration-slice'
import { locationSlice } from '../location/redux/location-slice'
import { appCoreSlice } from './slices/app-core'

/**
 * Store anything else here that should persist
 */
const persistedReducer = combineReducers({
  [environmentConfigurationSlice.name]: environmentConfigurationSlice.reducer,
  [onboardingSlice.name]: onboardingSlice.reducer,
  [locationSlice.name]: locationSlice.reducer,
  [appCoreSlice.name]: appCoreSlice.reducer,
  [cardSimulationSlice.name]: cardSimulationSlice.reducer,
})

type PersistState = ReturnType<typeof persistedReducer>

const persistConfig: ReduxPersist.PersistConfig<PersistState> = {
  key: 'persisted',
  storage: AsyncStorage,
}

export const createPersistReducer = () => ReduxPersist.persistReducer<PersistState>(persistConfig, persistedReducer)

export const reduxPersistIgnoredActions = [
  ReduxPersist.FLUSH,
  ReduxPersist.REHYDRATE,
  ReduxPersist.PAUSE,
  ReduxPersist.PERSIST,
  ReduxPersist.PURGE,
  ReduxPersist.REGISTER,
]
