import { Action } from '@reduxjs/toolkit'
import { setTokens } from '../../notifications/store/notifications-slice'
import { notificationsSyncPushToken } from '../../notifications/store/thunks/notifications-sync-push-token'
import { configureMockStore } from '../../testing/configure-mock-store'
import { onLoginFulfilled, onPushTokenSyncEffect, onSetTokens } from './on-push-token-sync'

describe('on-push-token-sync', () => {
  const store = configureMockStore()
  afterEach(() => {
    store.clearActions()
  })

  describe('onSetTokens', () => {
    it('should match with setTokens action', async () => {
      let effectDefinition: any

      onSetTokens(((action: Action) => {
        effectDefinition = action
      }) as any)

      const willRunEffect = effectDefinition.matcher(setTokens({ fcmToken: 'test' }))

      expect(willRunEffect).toBe(true)
    })
  })

  describe('onLoginFulfilled', () => {
    it('should match with authLogin action', async () => {
      const expectedTriggerAction = {
        payload: { loginID: 'test', password: 'test' },
        type: 'auth/login/fulfilled',
      }

      let effectDefinition: any

      onLoginFulfilled(((action: Action) => {
        effectDefinition = action
      }) as any)

      const willRunEffect = effectDefinition.matcher(expectedTriggerAction)

      expect(willRunEffect).toBe(true)
    })
  })

  describe('onPushTokenSyncEffect', () => {
    it('should dispatch notificationsSyncPushToken thunk', async () => {
      await onPushTokenSyncEffect(setTokens({ fcmToken: 'TEST' }), store as any)

      store.expectActions([{ type: notificationsSyncPushToken.pending.type }])
    })
  })
})
