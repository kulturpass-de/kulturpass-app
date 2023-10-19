import { AppStartListening } from '../listener-middleware'
import { onAppIsStarting } from './on-app-is-starting'
import { onGetAppConfigFulfilled, onGetAppConfigRejected } from './on-get-app-config-fulfilled'
import { onPersistRehydrate } from './on-persist-rehydrate'
import { onLoginFulfilled } from './on-push-token-sync'
import { onSetEnvironmentConfiguration } from './on-set-environment-configuration'
import { onSetIsInForeground } from './on-set-is-in-foreground'

export const addRootStoreEffects = (startListening: AppStartListening) => {
  onAppIsStarting(startListening)
  onPersistRehydrate(startListening)
  onGetAppConfigFulfilled(startListening)
  onGetAppConfigRejected(startListening)
  onSetEnvironmentConfiguration(startListening)
  onSetIsInForeground(startListening)
  onLoginFulfilled(startListening)
}
