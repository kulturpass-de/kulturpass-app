import { LegacySecureStorage as SecureStorage } from '../storage/legacy-secure-storage'

/**
 * This file, as well as src/services/storage/legacy-secure-storage.ts, should be removed after Sprint 6 is over. This
 * file contains only the remainings of the legacy SessionService, which are needed to migrate the already stored
 * session data to the format of the new SessionService.
 */

const CDC_SESSION_TOKEN = 'CDC_SESSION_TOKEN'
const CDC_SESSION_SECRET = 'CDC_SESSION_SECRET'
const CDC_SESSION_START_TIMESTAMP = 'CDC_SESSION_START_TIMESTAMP'
const CDC_SESSION_ID_TOKEN = 'CDC_SESSION_ID_TOKEN'
const CDC_SESSION_VALIDITY_SECONDS = 'CDC_SESSION_VALIDITY_SECONDS'
const CDC_PROFILE_FIRST_NAME = 'CDC_PROFILE_FIRST_NAME'
const CDC_UID = 'CDC_UID'
const CDC_UID_SIGNATURE = 'CDC_UID_SIGNATURE'
const CDC_REG_TOKEN = 'CDC_REG_TOKEN'
const CDC_IS_VERIFIED = 'CDC_IS_VERIFIED'

export const clearLegacyCdcSession = async () => {
  await Promise.all([
    SecureStorage.removeItem(CDC_SESSION_TOKEN),
    SecureStorage.removeItem(CDC_SESSION_SECRET),
    SecureStorage.removeItem(CDC_SESSION_START_TIMESTAMP),
    SecureStorage.removeItem(CDC_SESSION_ID_TOKEN),
    SecureStorage.removeItem(CDC_SESSION_VALIDITY_SECONDS),
    SecureStorage.removeItem(CDC_PROFILE_FIRST_NAME),
    SecureStorage.removeItem(CDC_UID),
    SecureStorage.removeItem(CDC_UID_SIGNATURE),
    SecureStorage.removeItem(CDC_REG_TOKEN),
    SecureStorage.removeItem(CDC_IS_VERIFIED),
  ])
}

// commerce
const CC_OAUTH_ACCESS_TOKEN = 'CC_OAUTH_ACCESS_TOKEN'
const CC_OAUTH_REFERENCE_TIMESTAMP = 'CC_OAUTH_REFERENCE_TIMESTAMP'
const CC_OAUTH_VALIDITY_SECONDS = 'CC_OAUTH_VALIDITY_SECONDS'

export const clearLegacyCommerceSession = async () => {
  await SecureStorage.removeItem(CC_OAUTH_ACCESS_TOKEN)
  await SecureStorage.removeItem(CC_OAUTH_REFERENCE_TIMESTAMP)
  await SecureStorage.removeItem(CC_OAUTH_VALIDITY_SECONDS)
}
