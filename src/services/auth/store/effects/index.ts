import { AppStartListening } from '../../../redux/listener-middleware'
import { onCdcSessionChange } from './on-cdc-session-change'

export const addAuthStoreEffects = (startListening: AppStartListening) => {
  onCdcSessionChange(startListening)
}
