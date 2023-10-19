export const firebase = {
  messaging: () => ({
    onNotificationOpenedApp: () => {},
    onMessage: () => {},
    onTokenRefresh: () => {},
    hasPermission: () => {},
    requestPermission: () => {},
    getToken: () => {},
    deleteToken: () => {},
    getAPNSToken: () => {},
    getInitialNotification: () => {},
  }),
}

export default {
  AuthorizationStatus: {
    NOT_DETERMINED: -2,
  },
}
