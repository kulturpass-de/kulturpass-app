import { Action } from '@reduxjs/toolkit'

import * as enforceAppConfigMinVersionModule from '../../../features/force-update/utils/enforce-app-config-min-version'
import { configureMockStore } from '../../testing/configure-mock-store'
import { AppConfig, appCoreSlice } from '../slices/app-core'
import { onGetAppConfigFulfilled, onGetAppConfigFulfilledEffect } from './on-get-app-config-fulfilled'

jest.mock('../thunks/startup')
jest.mock('../utils/verify-jws-with-jwk')

describe('on-get-app-config-fulfilled', () => {
  const store = configureMockStore()

  const expectedTriggerAction = {
    meta: { arg: { endpointName: 'getAppConfig' } },
    payload: 'new initialValue',
    type: 'commerceApi/executeQuery/fulfilled',
  }

  afterEach(() => {
    store.clearActions()
  })

  describe('onGetAppConfigFulfilled', () => {
    it('should match with setEnvironmentConfiguration action', async () => {
      let effectDefinition: any

      onGetAppConfigFulfilled(((action: Action) => {
        effectDefinition = action
      }) as any)

      const willRunEffect = effectDefinition.matcher(expectedTriggerAction)

      expect(willRunEffect).toBe(true)
    })
  })

  describe('onGetAppConfigFulfilledEffect', () => {
    it('should dispatch pollAppConfig thunk', async () => {
      const enforceAppConfigMinVersion = jest
        .spyOn(enforceAppConfigMinVersionModule, 'enforceAppConfigMinVersion')
        .mockImplementation(() => Promise.resolve({ appVersions: { min: '0.1.111' } } as AppConfig))

      await onGetAppConfigFulfilledEffect(expectedTriggerAction as any, store as any)

      expect(enforceAppConfigMinVersion).toHaveBeenCalledWith('payload decoded from new initialValue and publicKey')

      store.expectActions([
        {
          type: appCoreSlice.actions.setAppConfig.type,
          payload: 'payload decoded from new initialValue and publicKey',
        },
      ])
    })
  })
})
