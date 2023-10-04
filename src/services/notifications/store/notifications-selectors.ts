import { RootState } from '../../redux/configure-store'

export const selectNotificationsState = (state: RootState) => state.persisted.notifications
