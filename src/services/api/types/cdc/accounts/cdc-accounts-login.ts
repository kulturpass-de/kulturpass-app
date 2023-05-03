import { CdcApiBaseSuccessResponse } from '../cdc-api-base-success-response'
import { AccountInfoData, AccountInfoProfile } from './cdc-accounts-account-info'

export type AccountsLoginRequestParams = {
  loginID: string
  password: string
}

export type AccountsLoginResponse = CdcApiBaseSuccessResponse & {
  registeredTimestamp: number
  UID: string
  UIDSignature: string
  signatureTimestamp: number
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
    sessionToken: string
    sessionSecret: string
    expires_in?: number
  }
  id_token: string
  regToken?: string
}
