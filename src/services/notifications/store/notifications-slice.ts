import { Notification } from '@notifee/react-native'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { notificationsOpenReservation } from '../../notifications/store/thunks/notifications-open-reservations'
import { addIsLoadingAsyncThunkCases } from '../../redux/utils/add-is-loading-async-thunk-cases'
import { NotificationsState as PersistedNotificationState } from '../../redux/versions/version-1'

export const persistedInitialState: PersistedNotificationState = {}

export type NotificationsState = {
  isLoading: boolean
}

export const initialState: NotificationsState = {
  isLoading: false,
}

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    addIsLoadingAsyncThunkCases(builder, notificationsOpenReservation, 'isLoading')
  },
})

export const persistedNotificationsSlice = createSlice({
  name: 'notifications',
  initialState: persistedInitialState,
  reducers: {
    setTokens: (state, action: PayloadAction<Omit<PersistedNotificationState, 'backgroundPressedNotification'>>) => {
      if (action.payload.fcmToken !== state.fcmToken) {
        state.previousFcmToken = state.fcmToken
      }
      state.fcmToken = action.payload.fcmToken
      state.apnsToken = action.payload.apnsToken
    },
    setBackgroundPressedNotification: (state, action: PayloadAction<Notification | undefined>) => {
      state.backgroundPressedNotification = action.payload
    },
    deleteFcmToken: state => {
      state.fcmToken = persistedInitialState.fcmToken
    },
  },
})

export const { setTokens, setBackgroundPressedNotification, deleteFcmToken } = persistedNotificationsSlice.actions
