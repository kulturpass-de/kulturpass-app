import { AppStartListening } from '../../../redux/listener-middleware'
import { onRefreshLocationFulfilled } from './on-refresh-location-fulfilled'

export const addLocationEffects = (startListening: AppStartListening) => {
  onRefreshLocationFulfilled(startListening)
}
