import notifee, { EventType, Event } from '@notifee/react-native'
import { logger } from '../../logger'
import { AppStore } from '../../redux/configure-store'
import { openReservation } from './open-reservation'

export const subscribeToPressAction = (store: AppStore['store']) => {
  const eventHandler = (event: Event) => {
    if (event.type === EventType.PRESS) {
      logger.log('subscribeToPressAction notification pressed')
      const orderCode = event.detail.notification?.data?.orderCode
      if (typeof orderCode === 'string') {
        openReservation(store, orderCode)
      }
    }
  }
  notifee.onForegroundEvent(eventHandler)
}
