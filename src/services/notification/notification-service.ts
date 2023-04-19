import { RESULTS, checkNotifications, requestNotifications } from 'react-native-permissions'
import { NotificationService } from './types'

export const createNotificationService = (): NotificationService => {
  return {
    async requestNotificationPermission() {
      // TODO: Check which notification options should be set (ios only)
      const result = await requestNotifications(['alert', 'sound'])
      if (result.status !== RESULTS.GRANTED) {
        console.log('Notification Permission not granted')
      }
    },
    async checkNotificationPermission() {
      const response = await checkNotifications()
      return response.status === RESULTS.GRANTED
    },
  }
}

export const notificationService = createNotificationService()
