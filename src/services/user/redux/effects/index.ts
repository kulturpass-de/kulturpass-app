import { AppStartListening } from '../../../redux/listener-middleware'
import { onPreferencesChange } from './on-preferences-change'

export const addUserEffects = (startListening: AppStartListening) => {
  onPreferencesChange(startListening)
}
