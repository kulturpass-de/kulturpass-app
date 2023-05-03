import { Action } from '@reduxjs/toolkit'

import { setEnvironmentConfiguration } from '../../environment-configuration/redux/environment-configuration-slice'
import { configureMockStore } from '../../testing/configure-mock-store'
import { pollAppConfig } from '../thunks/poll-app-config'
import { onSetEnvironmentConfiguration, onSetEnvironmentConfigurationEffect } from './on-set-environment-configuration'

jest.mock('../thunks/poll-app-config')

describe('on-set-environment-configuration', () => {
  const store = configureMockStore()

  afterEach(() => {
    store.clearActions()
  })

  describe('onSetEnvironmentConfiguration', () => {
    it('should match with setEnvironmentConfiguration action', async () => {
      let effectDefinition: any

      onSetEnvironmentConfiguration(((action: Action) => {
        effectDefinition = action
      }) as any)

      const willRunEffect = effectDefinition.matcher(setEnvironmentConfiguration('test'))

      expect(willRunEffect).toBe(true)
    })
  })

  describe('onSetEnvironmentConfigurationEffect', () => {
    it('should dispatch pollAppConfig thunk', async () => {
      await onSetEnvironmentConfigurationEffect(setEnvironmentConfiguration('test'), store as any)

      store.expectActions([{ type: pollAppConfig.pending.type }])
    })
  })
})
