import notifee from '@notifee/react-native';
import { firebase } from '@react-native-firebase/messaging';
import { AppRegistry } from 'react-native';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { name as appName } from './app.json';
import { App } from './src/app';
import { AppHeadless } from './src/app-headless';
import { notificationsHandleBackgroundMessage } from './src/services/notifications/store/thunks/notifications-handle-background-message';
import { notificationsHandleBackgroundPressEvent } from './src/services/notifications/store/thunks/notifications-handle-background-press-event';
import { store } from './src/services/redux/store';
import './src/services/translation/translation-polyfills';

// Register background handler for remote notifications
firebase.messaging().setBackgroundMessageHandler(async notification => {
  await store.dispatch(notificationsHandleBackgroundMessage(notification)).unwrap();
});
// Register background handler for notification pressed in background
notifee.onBackgroundEvent(async event => {
  await store.dispatch(notificationsHandleBackgroundPressEvent(event)).unwrap();
});

// Check if app was launched in the background and conditionally render null if so
const HeadlessCheck = ({ isHeadless }) => {
  if (isHeadless) {
    console.log('--- App has been launched in the background');
    // App has been launched in the background by iOS, ignore
    return <AppHeadless />;
  }

  console.log('--- Render the app component on foreground');
  // Render the app component on foreground launch
  return <App />;
};

AppRegistry.registerComponent(appName, () => HeadlessCheck);
