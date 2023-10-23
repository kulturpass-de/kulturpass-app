import { enforceAppConfigMinVersion } from '../../../features/force-update/utils/enforce-app-config-min-version'
import { commerceApi } from '../../api/commerce-api'
import { getCurrentEnvironmentConfigurationName } from '../../environment-configuration/redux/environment-configuration-selectors'
import { getEnvironmentConfig } from '../../environment-configuration/utils'
import { ErrorWithCode } from '../../errors/errors'
import { AppStartListening, ListenerEffect, ListenerEffectMatcherAction } from '../listener-middleware'
import { persistedAppCoreSlice } from '../slices/persisted-app-core'
import { AppConfigSchema } from '../utils/app-config-schema'
import { verifyJwsWithJwk } from '../utils/verify-jws-with-jwk'
import { AppConfig } from '../versions/current'

export const onGetAppConfigFulfilledEffect: ListenerEffect<
  ListenerEffectMatcherAction<typeof commerceApi.endpoints.getAppConfig.matchFulfilled>
> = async (action, listenerApi) => {
  const envConfigName = getCurrentEnvironmentConfigurationName(listenerApi.getState())

  const currentEnvironment = getEnvironmentConfig(envConfigName)

  let appConfigString: string

  try {
    appConfigString = await verifyJwsWithJwk(action.payload, currentEnvironment.appConfig.publicKey)
  } catch (error) {
    appConfigString = await verifyJwsWithJwk(action.payload, currentEnvironment.appConfig.backupPublicKey)
  }

  let appConfig: AppConfig
  try {
    appConfig = AppConfigSchema.parse(JSON.parse(appConfigString))
  } catch (_error1) {
    try {
      // Load from environment configuration if parse failed.
      appConfigString = await verifyJwsWithJwk(
        currentEnvironment.appConfig.initialValue,
        currentEnvironment.appConfig.publicKey,
      )
      appConfig = AppConfigSchema.parse(JSON.parse(appConfigString))
    } catch (_error2) {
      throw new ErrorWithCode(
        'Could not parse the received AppConfig according to AppConfigSchema',
        'onGetAppConfigFulfilledEffect',
      )
    }
  }

  enforceAppConfigMinVersion(appConfig)

  listenerApi.dispatch(persistedAppCoreSlice.actions.setAppConfig(appConfig))
}

export const onGetAppConfigRejectedEffect: ListenerEffect<
  ListenerEffectMatcherAction<typeof commerceApi.endpoints.getAppConfig.matchRejected>
> = async (_action, listenerApi) => {
  const envConfigName = getCurrentEnvironmentConfigurationName(listenerApi.getState())

  const currentEnvironment = getEnvironmentConfig(envConfigName)

  try {
    const appConfigString = await verifyJwsWithJwk(
      currentEnvironment.appConfig.initialValue,
      currentEnvironment.appConfig.publicKey,
    )

    const appConfig = AppConfigSchema.parse(JSON.parse(appConfigString))
    listenerApi.dispatch(persistedAppCoreSlice.actions.setAppConfig(appConfig))
  } catch (_error) {
    throw new ErrorWithCode(
      'Could not parse the received AppConfig according to AppConfigSchema',
      'onGetAppConfigFulfilledEffect',
    )
  }
}

export const onGetAppConfigFulfilled = (startListening: AppStartListening) =>
  startListening({ matcher: commerceApi.endpoints.getAppConfig.matchFulfilled, effect: onGetAppConfigFulfilledEffect })

export const onGetAppConfigRejected = (startListening: AppStartListening) =>
  startListening({ matcher: commerceApi.endpoints.getAppConfig.matchRejected, effect: onGetAppConfigRejectedEffect })
