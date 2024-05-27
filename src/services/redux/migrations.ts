import { PersistedState } from 'redux-persist'
import { PersistState as PersistState0 } from './versions/version-0'
import { PersistState as PersistState1 } from './versions/version-1'
import { PersistState as PersistState2 } from './versions/version-2'
import { PersistState as PersistState3 } from './versions/version-3'

export const currentPersistVersion = 2

export const migrations = {
  0: (state: PersistedState & { [key: string]: any }): PersistState0 & PersistedState => {
    // first migration which just takes the current state
    // and increase the current version of -1 to 0

    // @ts-expect-error wrongly typed
    return { ...state }
  },
  1: (state: PersistState0 & PersistedState): PersistState1 & PersistedState => {
    const { appCore, ...stateWithoutAppCore } = state

    return {
      ...stateWithoutAppCore,
      apiOfflineCache: { commerceApi: {} },
      persistedAppCore: appCore,
      inAppReview: {},
      notifications: {},
    }
  },
  2: (state: PersistState1 & PersistedState): PersistState2 & PersistedState => {
    return {
      ...state,
      apiOfflineCache: { commerceApi: {} },
    }
  },
  3: (state: PersistState2 & PersistedState): PersistState3 & PersistedState => {
    return {
      ...state,
      deltaOnboarding: {},
    }
  },
}
