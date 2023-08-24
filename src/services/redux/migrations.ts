import { PersistedState } from 'redux-persist'
import { PersistState as PersistState0 } from './versions/version-0'

export const currentPersistVersion = 0

// Uncomment this to see an example
// type PersistState1 = PersistState0 & {
//   kultur: string
// }

export const migrations = {
  0: (state: PersistedState & { [key: string]: any }): PersistState0 & PersistedState => {
    // first migration which just takes the current state
    // and increase the current version of -1 to 0

    // @ts-expect-error wrongly typed
    return { ...state }
  },
  // Uncomment this to see an example
  // 1: (state: PersistState0 & PersistedState): PersistState1 & PersistedState => {
  //   return {
  //     ...state,
  //     kultur: ''
  //   }
  // }
}
