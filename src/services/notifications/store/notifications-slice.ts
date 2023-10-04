import { Notification } from '@notifee/react-native'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { NotificationsState } from '../../redux/versions/version-1'

export const initialState: NotificationsState = {}

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<Omit<NotificationsState, 'backgroundPressedNotification'>>) => {
      if (action.payload.fcmToken !== state.fcmToken) {
        state.previousFcmToken = state.fcmToken
      }
      state.fcmToken = action.payload.fcmToken
      state.apnsToken = action.payload.apnsToken
    },
    setBackgroundPressedNotification: (state, action: PayloadAction<Notification | undefined>) => {
      state.backgroundPressedNotification = action.payload
    },
  },
})

export const { setTokens, setBackgroundPressedNotification } = notificationsSlice.actions
