import { setEnvironmentConfiguration } from '../../environment-configuration/redux/environment-configuration-slice'
import { AppStartListening, ListenerEffect, ListenerEffectMatcherAction } from '../listener-middleware'
import { pollAppConfig } from '../thunks/poll-app-config'

export const onSetEnvironmentConfigurationEffect: ListenerEffect<
  ListenerEffectMatcherAction<typeof setEnvironmentConfiguration.match>
> = async (action, listenerApi) => {
  listenerApi.dispatch(pollAppConfig())
}

export const onSetEnvironmentConfiguration = (startListening: AppStartListening) =>
  startListening({ matcher: setEnvironmentConfiguration.match, effect: onSetEnvironmentConfigurationEffect })
