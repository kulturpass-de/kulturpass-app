import notifee, { Notification } from '@notifee/react-native'
import { AppState } from 'react-native'
import { z } from 'zod'
import { logger } from '../../logger'
import { fallbackLng } from '../../translation/setup'

const NotificationDataPayloadSchema = z.object({
  titleDE: z.string().optional(),
  titleEN: z.string().optional(),
  bodyDE: z.string(),
  bodyEN: z.string().optional(),
  orderCode: z.string().optional(),
})

export const handleDataNotification = async (payload: unknown, language: string = fallbackLng) => {
  logger.log('handleDataNotification', payload)

  try {
    const parsedData = NotificationDataPayloadSchema.parse(payload)
    const body = (language === 'de' ? parsedData.bodyDE : parsedData.bodyEN) ?? parsedData.bodyDE
    const title = (language === 'de' ? parsedData.titleDE : parsedData.titleEN) ?? 'KulturPass'
    const data = parsedData.orderCode
      ? {
          orderCode: parsedData.orderCode,
        }
      : undefined

    const platformOptions: Notification = {
      android: {
        channelId: await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
          sound: 'default',
        }),
        pressAction: {
          id: 'default',
        },
        sound: 'default',
        smallIcon: 'ic_notification',
      },
      ios: {
        sound: 'default',
      },
    }

    logger.log('handleDataNotification - displayNotification ', body)
    logger.log('handleDataNotification - displayNotification ', data)

    await notifee.displayNotification({
      title,
      body,
      data,
      ...platformOptions,
    })
    if (AppState.currentState !== 'active') {
      await notifee.incrementBadgeCount()
    }
  } catch (error: unknown) {
    logger.logError('handleDataNotification()', error)
  }
}
