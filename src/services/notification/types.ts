export type NotificationService = {
  checkNotificationPermission(): Promise<boolean>
  requestNotificationPermission(): Promise<void>
}
