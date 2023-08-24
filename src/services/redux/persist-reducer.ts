import AsyncStorage from '@react-native-async-storage/async-storage'
import { combineReducers } from '@reduxjs/toolkit'
import * as ReduxPersist from 'redux-persist'
import createMigrate from 'redux-persist/es/createMigrate'
import { cardSimulationSlice } from '../../features/eid-verification/redux/simulated-card'
import { onboardingSlice } from '../../features/onboarding/redux/onboarding'
import { releaseNotesSlice } from '../../features/release-notes/redux/release-notes-slice'
import { environmentConfigurationSlice } from '../environment-configuration/redux/environment-configuration-slice'
import { locationSlice } from '../location/redux/location-slice'
import { currentPersistVersion, migrations } from './migrations'
import { appCoreSlice } from './slices/app-core'
import { PersistState } from './versions/current'

/**
 * Store anything else here that should persist
 */
const persistedReducer = combineReducers({
  [environmentConfigurationSlice.name]: environmentConfigurationSlice.reducer,
  [releaseNotesSlice.name]: releaseNotesSlice.reducer,
  [onboardingSlice.name]: onboardingSlice.reducer,
  [locationSlice.name]: locationSlice.reducer,
  [appCoreSlice.name]: appCoreSlice.reducer,
  [cardSimulationSlice.name]: cardSimulationSlice.reducer,
})

const persistConfig: ReduxPersist.PersistConfig<PersistState> = {
  key: 'persisted',
  storage: AsyncStorage,
  version: currentPersistVersion,
  // @ts-expect-error `createMigrate` is wrongly typed
  migrate: createMigrate(migrations, {
    debug: __DEV__,
  }),
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
