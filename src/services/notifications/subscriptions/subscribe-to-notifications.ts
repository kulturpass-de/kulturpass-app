import { firebase } from '@react-native-firebase/messaging'
import { v4 as uuid } from 'uuid'
import { logger } from '../../logger'
import { AppStore } from '../../redux/configure-store'
import { selectLastUsedTranslationLanguage } from '../../redux/slices/persisted-app-core'
import { notificationsDebugActions } from '../store/notifications-debug-slice'
import { handleDataNotification } from './handle-data-notification'

export const subscribeToNotifications = (store: AppStore['store']) => {
  const messaging = firebase.messaging()

  /**
   * Get the notification that opened the app
   */
  messaging.onNotificationOpenedApp(notification => {
    logger.log('--- notifications notificationOpenedApp', JSON.stringify(notification))
    store.dispatch(
      notificationsDebugActions.addEvent({ id: uuid(), type: 'notificationOpenedApp', payload: notification }),
    )
  })

  /**
   * Subscribe to all messages
   */
  messaging.onMessage(async notification => {
    logger.log('--- notifications message', JSON.stringify(notification))
    store.dispatch(notificationsDebugActions.addEvent({ id: uuid(), type: 'message', payload: notification }))
    await handleDataNotification(notification.data, selectLastUsedTranslationLanguage(store.getState()))
  })
}
