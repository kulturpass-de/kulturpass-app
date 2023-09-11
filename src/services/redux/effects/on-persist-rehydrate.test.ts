import { Action } from '@reduxjs/toolkit'
import { REHYDRATE } from 'redux-persist'
import { authValidateSession } from '../../auth/store/thunks/auth-validate-session'
import { refreshLocation } from '../../location/redux/thunks/refresh-location'
import { configureMockStore } from '../../testing/configure-mock-store'
import { appCoreSlice } from '../slices/app-core'
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

      store.expectActions([
        { type: startup.pending.type },
        { type: refreshLocation.pending.type },
        { type: authValidateSession.pending.type },
        { type: appCoreSlice.actions.setIsStoreRehydrated.type },
      ])
    })
  })
})
