import { firebase } from '@react-native-firebase/messaging'
import { v4 as uuid } from 'uuid'
import { logger } from '../../logger'
import { AppStore } from '../../redux/configure-store'
import { rehydrationPromise } from '../../redux/effects/on-persist-rehydrate'
import { selectLastUsedTranslationLanguage } from '../../redux/slices/persisted-app-core'
import { notificationsDebugActions } from '../store/notifications-debug-slice'
import { handleDataNotification } from './handle-data-notification'

export const subscribeToNotifications = (store: AppStore['store']) => {
  const messaging = firebase.messaging()

  /**
   * Subscribe to all messages
   */
  messaging.onMessage(async notification => {
    logger.log('--- notifications message', JSON.stringify(notification))
    store.dispatch(notificationsDebugActions.addEvent({ id: uuid(), type: 'message', payload: notification }))
    await rehydrationPromise
    await handleDataNotification(notification.data, selectLastUsedTranslationLanguage(store.getState()))
  })
}
