import { AppStartListening } from '../listener-middleware'
import { onPersistRehydrate } from './on-persist-rehydrate'

export const addRootStoreEffects = (startListening: AppStartListening) => {
  onPersistRehydrate(startListening)
}
