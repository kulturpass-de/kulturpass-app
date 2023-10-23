import { RootState } from '../../redux/configure-store'

export const selectPersistedNotificationsState = (state: RootState) => state.persisted.notifications
export const selectBackroundPressedNotification = (state: RootState) =>
  state.persisted.notifications.backgroundPressedNotification
export const selectReservationOpenIsLoading = (state: RootState) => state.notifications.isLoading
