import { enforceAppConfigMinVersion } from '../../../features/force-update/utils/enforce-app-config-min-version'
import { commerceApi } from '../../api/commerce-api'
import { getEnvironmentConfigurationState } from '../../environment-configuration/redux/environment-configuration-selectors'
import { ErrorWithCode } from '../../errors/errors'
import { AppStartListening, ListenerEffect, ListenerEffectMatcherAction } from '../listener-middleware'
import { AppConfig, appCoreSlice } from '../slices/app-core'
import { AppConfigSchema } from '../utils/app-config-schema'
import { verifyJwsWithJwk } from '../utils/verify-jws-with-jwk'

export const onGetAppConfigFulfilledEffect: ListenerEffect<
  ListenerEffectMatcherAction<typeof commerceApi.endpoints.getAppConfig.matchFulfilled>
> = async (action, listenerApi) => {
  const { currentEnvironment } = getEnvironmentConfigurationState(listenerApi.getState())

  let appConfigString: string
  try {
    appConfigString = await verifyJwsWithJwk(action.payload, currentEnvironment.appConfig.publicKey)
  } catch (error) {
    appConfigString = await verifyJwsWithJwk(action.payload, currentEnvironment.appConfig.backupPublicKey)
  }

  let appConfig: AppConfig
  try {
    appConfig = AppConfigSchema.parse(JSON.parse(appConfigString))
  } catch (error) {
    throw new ErrorWithCode(
      'Could not parse the received AppConfig according to AppConfigSchema',
      'onGetAppConfigFulfilledEffect',
    )
  }

  enforceAppConfigMinVersion(appConfig)

  listenerApi.dispatch(appCoreSlice.actions.setAppConfig(appConfig))
}

export const onGetAppConfigFulfilled = (startListening: AppStartListening) =>
  startListening({ matcher: commerceApi.endpoints.getAppConfig.matchFulfilled, effect: onGetAppConfigFulfilledEffect })
