import { Action } from '@reduxjs/toolkit'
import { configureMockStore } from '../../testing/configure-mock-store'
import { appCoreSlice } from '../slices/app-core'
import { startup } from '../thunks/startup'
import { onAppIsStarting, onAppIsStartingEffect } from './on-app-is-starting'

jest.mock('../thunks/startup')

describe('on-app-is-starting', () => {
  const store = configureMockStore()

  afterEach(() => {
    store.clearActions()
  })

  describe('onAppIsStarting', () => {
    it('should match with setIsAppRendered and setIsStoreRehydrated action', async () => {
      let effectDefinition: any

      onAppIsStarting(((action: Action) => {
        effectDefinition = action
      }) as any)

      const willRunEffect1 = effectDefinition.matcher(appCoreSlice.actions.setIsAppRendered(true))

      expect(willRunEffect1).toBe(true)

      const willRunEffect2 = effectDefinition.matcher(appCoreSlice.actions.setIsStoreRehydrated(true))

      expect(willRunEffect2).toBe(true)
    })
  })

  describe('onAppIsStartingEffect', () => {
    it('should dispatch startup thunk if isAppRendered and isStoreRehydrated are true', async () => {
      await onAppIsStartingEffect({ type: appCoreSlice.actions.setIsAppRendered.type }, store as any)

      store.expectActionNotDispatched(startup.pending.match)

      store.dispatch(appCoreSlice.actions.setIsAppRendered(true))

      await onAppIsStartingEffect({ type: appCoreSlice.actions.setIsAppRendered.type }, store as any)

      store.expectActionNotDispatched(startup.pending.match)

      store.dispatch(appCoreSlice.actions.setIsStoreRehydrated(true))

      await onAppIsStartingEffect({ type: appCoreSlice.actions.setIsStoreRehydrated.type }, store as any)

      expect(store.findAction(startup.pending.match)).toBeDefined()
    })
  })
})
