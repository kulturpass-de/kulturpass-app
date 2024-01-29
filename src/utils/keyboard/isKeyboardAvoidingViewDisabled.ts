import { Platform } from 'react-native'
import { getSystemVersion } from 'react-native-device-info'
import { logger } from '../../services/logger'

export const isKeyboardAvoidingViewDisabled = () => {
  if (Platform.OS === 'ios') {
    let disabled = false

    try {
      // below iOS 17, there is an issue with the keyboard in a webview
      disabled = Number(getSystemVersion().split('.')[0]) < 17
    } catch (error) {
      logger.logError('iOS checking system version', error)
    }

    return disabled
  }

  return false
}
