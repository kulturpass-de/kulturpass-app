import { Action } from '@reduxjs/toolkit'
import { REHYDRATE } from 'redux-persist'
import { configureMockStore } from '../../testing/configure-mock-store'
import { startup } from '../thunks/startup'
import { onPersistRehydrate, onPersistRehydrateEffect } from './on-persist-rehydrate'

jest.mock('../thunks/startup')

describe('on-persist-rehydrate', () => {
  const store = configureMockStore()

  afterEach(() => {
    store.clearActions()
  })

  describe('onPersistRehydrate', () => {
    it('should match with setEnvironmentConfiguration action', async () => {
      let effectDefinition: any

      onPersistRehydrate(((action: Action) => {
        effectDefinition = action
      }) as any)

      expect(effectDefinition.type).toBe(REHYDRATE)
    })
  })

  describe('onPersistRehydrateEffect', () => {
    it('should dispatch pollAppConfig thunk', async () => {
      await onPersistRehydrateEffect({ type: REHYDRATE }, store as any)

      store.expectActions([{ type: startup.pending.type }])
    })
  })
})
