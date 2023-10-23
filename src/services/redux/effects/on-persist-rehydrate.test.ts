import { Action } from '@reduxjs/toolkit'
import { REHYDRATE } from 'redux-persist'
import { configureMockStore } from '../../testing/configure-mock-store'
import { appCoreSlice } from '../slices/app-core'
import { onPersistRehydrate, onPersistRehydrateEffect } from './on-persist-rehydrate'

describe('on-persist-rehydrate', () => {
  const store = configureMockStore()

  afterEach(() => {
    store.clearActions()
  })

  describe('onPersistRehydrate', () => {
    it('should match with REHYDRATE action', async () => {
      let effectDefinition: any

      onPersistRehydrate(((action: Action) => {
        effectDefinition = action
      }) as any)

      expect(effectDefinition.type).toBe(REHYDRATE)
    })
  })

  describe('onPersistRehydrateEffect', () => {
    it('should dispatch setIsStoreRehydrated thunk', async () => {
      await onPersistRehydrateEffect({ type: REHYDRATE }, store as any)

      store.expectActions([{ type: appCoreSlice.actions.setIsStoreRehydrated.type }])
    })
  })
})
