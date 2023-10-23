import { AppStartListening } from '../listener-middleware'
import { onGetAppConfigFulfilled, onGetAppConfigRejected } from './on-get-app-config-fulfilled'
import { onPersistRehydrate } from './on-persist-rehydrate'
import { onSetEnvironmentConfiguration } from './on-set-environment-configuration'
import { onSetIsInForeground } from './on-set-is-in-foreground'

export const addRootStoreEffects = (startListening: AppStartListening) => {
  onPersistRehydrate(startListening)
  onGetAppConfigFulfilled(startListening)
  onGetAppConfigRejected(startListening)
  onSetEnvironmentConfiguration(startListening)
  onSetIsInForeground(startListening)
}
