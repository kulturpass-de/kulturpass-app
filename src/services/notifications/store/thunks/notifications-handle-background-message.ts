import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { v4 as uuid } from 'uuid'
import { rehydrationPromise } from '../../../redux/effects/on-persist-rehydrate'
import { selectLastUsedTranslationLanguage } from '../../../redux/slices/persisted-app-core'
import { createThunk } from '../../../redux/utils/create-thunk'
import { handleDataNotification } from '../../subscriptions/handle-data-notification'
import { notificationsDebugActions } from '../notifications-debug-slice'

export const notificationsHandleBackgroundMessage = createThunk<void, FirebaseMessagingTypes.RemoteMessage>(
  'notifications/handleBackgroundMessage',
  async (payload, thunkAPI) => {
    await rehydrationPromise
    thunkAPI.dispatch(notificationsDebugActions.addEvent({ id: uuid(), type: 'backgroundMessage', payload }))
    await handleDataNotification(payload.data, selectLastUsedTranslationLanguage(thunkAPI.getState()))
  },
)
