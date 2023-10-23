import { CdcApiBaseSuccessResponse } from '../cdc-api-base-success-response'
import { AccountInfoData, AccountInfoProfile } from './cdc-accounts-account-info'

export type AccountsFinalizeRegistrationRequestParams = {
  regToken: string
}

export type AccountsFinalizeRegistrationResponse = CdcApiBaseSuccessResponse & {
  registeredTimestamp: number
  UID: string
  UIDSignature: string
  signatureTimestamp: string
  created: string
  createdTimestamp: number
  isActive: boolean
  isRegistered: boolean
  isVerified: boolean
  lastLogin: string
  lastLoginTimestamp: number
  lastUpdated: string
  lastUpdatedTimestamp: number
  loginProvider: string
  oldestDataUpdated: string
  oldestDataUpdatedTimestamp: number
  profile: AccountInfoProfile
  data: AccountInfoData
  registered: string
  socialProviders: string
  verified: string
  verifiedTimestamp: number
  newUser: false
  sessionInfo: {
    sessionToken?: string
    sessionSecret?: string
    expires_in?: string
  }
  id_token: string
  regToken?: string
}
