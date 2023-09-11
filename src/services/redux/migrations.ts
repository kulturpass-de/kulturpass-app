import { PersistedState } from 'redux-persist'
import { PersistState as PersistState0 } from './versions/version-0'
import { PersistState as PersistState1 } from './versions/version-1'

export const currentPersistVersion = 1

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
    }
  },
}
