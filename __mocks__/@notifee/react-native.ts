export default {
  displayNotification: jest.fn(),
  createChannel: jest.fn(),
  onForegroundEvent: jest.fn(),
  getDisplayedNotifications: jest.fn(() => Promise.resolve([])),
  cancelDisplayedNotifications: jest.fn(() => Promise.resolve()),
}
