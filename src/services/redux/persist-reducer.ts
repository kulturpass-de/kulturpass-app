import AsyncStorage from '@react-native-async-storage/async-storage'
import { combineReducers } from '@reduxjs/toolkit'
import * as ReduxPersist from 'redux-persist'
import createMigrate from 'redux-persist/es/createMigrate'
import { deltaOnboardingSlice } from '../../features/delta-onboarding/redux/delta-onboarding-slice'
import { cardSimulationSlice } from '../../features/eid-verification/redux/simulated-card'
import { inAppReviewSlice } from '../../features/in-app-review/redux/in-app-review'
import { releaseNotesSlice } from '../../features/release-notes/redux/release-notes-slice'
import { apiOfflineCacheSlice } from '../api/redux/api-offline-cache-slice'
import { environmentConfigurationSlice } from '../environment-configuration/redux/environment-configuration-slice'
import { persistedNotificationsSlice } from '../notifications/store/notifications-slice'
import { currentPersistVersion, migrations } from './migrations'
import { onboardingSlice } from './slices/onboarding'
import { persistedAppCoreSlice } from './slices/persisted-app-core'
import { PersistState } from './versions/current'

/**
 * Store anything else here that should persist
 */
const persistedReducer = combineReducers({
  [environmentConfigurationSlice.name]: environmentConfigurationSlice.reducer,
  [releaseNotesSlice.name]: releaseNotesSlice.reducer,
  [onboardingSlice.name]: onboardingSlice.reducer,
  [deltaOnboardingSlice.name]: deltaOnboardingSlice.reducer,
  [persistedAppCoreSlice.name]: persistedAppCoreSlice.reducer,
  [cardSimulationSlice.name]: cardSimulationSlice.reducer,
  [apiOfflineCacheSlice.name]: apiOfflineCacheSlice.reducer,
  [inAppReviewSlice.name]: inAppReviewSlice.reducer,
  [persistedNotificationsSlice.name]: persistedNotificationsSlice.reducer,
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
