import { firebase, FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { createThunk } from '../../../redux/utils/create-thunk'

export const notificationsCheckPermissions = createThunk<FirebaseMessagingTypes.AuthorizationStatus>(
  'notifications/checkPermissions',
  async (_payload, _thunkAPI) => {
    const messaging = firebase.messaging()

    return await messaging.hasPermission()
  },
)
