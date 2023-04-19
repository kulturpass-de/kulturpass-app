import rnEncryptedStorage from 'react-native-encrypted-storage'

import { parseJsonIfValid, stringify } from './helpers'
import { StorageProvider } from './types'

/**
 * This file, as well as src/services/session/legacy-session-service.ts, should be removed after Sprint 6 is over. This
 * file contains only the remainings of the legacy SecureStorage, which are needed to migrate the already stored
 * session data to the format of the new SecureStorage.
 */

const createLegacySecureStorage = (): StorageProvider => {
  return {
    async getItem(key) {
      // getItem() returns `null` on Android and `undefined` on iOS;
      // explicitly return `null` here as `undefined` causes an exception
      // upstream.
      let result: string | null = (await rnEncryptedStorage.getItem(key)) ?? null
      return parseJsonIfValid(result)
    },

    async setItem(key, value) {
      const newValue = stringify(value)
      try {
        await rnEncryptedStorage.setItem(key, newValue)
      } catch (e) {
        console.warn(
          `ERROR in SecureStorage.setItem for key=${key} value=${value} typeof value=${typeof value} typeof newValue=${typeof newValue} newValue=${newValue}`,
          e,
        )
        throw e
      }
    },

    async removeItem(key) {
      const existing = await rnEncryptedStorage.getItem(key)
      if (existing !== undefined) {
        await rnEncryptedStorage.removeItem(key)
      }
    },
  }
}

export const LegacySecureStorage = createLegacySecureStorage()
