import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { env } from '../../../env'
import { RootState } from '../../redux/configure-store'

export type NotificationEvent = {
  id: string
  type: 'message' | 'backgroundMessage'
  payload: Record<string, any>
}

export type NotificationsDebugState = {
  notificationEvents: NotificationEvent[]
}

export const initialState: NotificationsDebugState = {
  notificationEvents: [],
}

export const notificationsDebugSlice = createSlice({
  name: 'notificationsDebug',
  initialState: initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<NotificationEvent>) => {
      if (env.DEV_MENU) {
        state.notificationEvents.push(action.payload)
      }
    },
    clearEvents: state => {
      state.notificationEvents = []
    },
  },
})

export const notificationsDebugActions = notificationsDebugSlice.actions

export const selectNotificationsDebugState = (state: RootState) => state.notificationsDebug

export const selectNotificationsDebugEvents = createSelector(
  selectNotificationsDebugState,
  notificationsDebugState => notificationsDebugState.notificationEvents,
)
