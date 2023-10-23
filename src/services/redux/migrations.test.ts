/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PersistedState } from 'redux-persist'
import createMigrate from 'redux-persist/es/createMigrate'
import { createPersistReducer } from './persist-reducer'
import { PersistState as PersistState0 } from './versions/version-0'

type PersistState1 = PersistState0 & {
  kultur: string
}

test('Should migrate from -1 to 1', async () => {
  jest.spyOn(global.console, 'log').mockImplementation(() => {})
  /**
   * This is the state how it will look when the first migration will run
   */
  // const stateWithoutVersion: PersistedState = {
  //   _persist: {
  //     rehydrated: true,
  //     version: -1,
  //   },
  //   ...ourDefaultStore
  // }
  const stateWithoutVersion = createPersistReducer()(undefined, { type: '' })

  const migrations = {
    0: (state: PersistedState & { [key: string]: any }): PersistState0 & PersistedState => {
      // @ts-expect-error
      return { ...state }
    },
    1: (state: PersistState0 & PersistedState): PersistState1 & PersistedState => {
      return {
        ...state,
        kultur: 'pass',
      }
    },
  }

  const migrateToVersion = 1

  // @ts-expect-error
  const migrate = createMigrate(migrations, { debug: true })
  // @ts-expect-error
  const result: PersistState1 = await migrate(stateWithoutVersion, migrateToVersion)
  expect(result.kultur).toBe('pass')
  // expect(result?.kultur).toBe('pass')
})
