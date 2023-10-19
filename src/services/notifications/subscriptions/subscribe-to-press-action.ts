import notifee, { EventType, Event } from '@notifee/react-native'
import { logger } from '../../logger'
import { AppStore } from '../../redux/configure-store'
import { notificationsOpenReservation } from '../store/thunks/notifications-open-reservations'

export const subscribeToPressAction = (store: AppStore['store']) => {
  const eventHandler = async (event: Event) => {
    if (event.type === EventType.PRESS) {
      logger.log('subscribeToPressAction notification pressed')
      const orderCode = event.detail.notification?.data?.orderCode
      if (typeof orderCode === 'string') {
        await store.dispatch(notificationsOpenReservation({ orderCode })).unwrap()
      }
    }
  }
  notifee.onForegroundEvent(eventHandler)
}
