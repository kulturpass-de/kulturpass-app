import { CdcApiBaseSuccessResponse } from '../cdc-api-base-success-response'

export type AccountsRegisterRequestParams = {
  regToken: string
  email: string
  password: string
  profile: {
    firstName: string
    lastName: string
  }
  data: {
    dateOfBirth: string
  }
}

export type AccountsRegisterResponse = CdcApiBaseSuccessResponse & {
  UID: string
  created: string
  createdTimestamp: number
  emails: {
    unverified: string[]
    verified: string[]
  }
  errorDetails: string
  errorMessage: string
  isActive: boolean
  isRegistered: boolean
  isVerified: boolean
  lastUpdated: string
  lastUpdatedTimestamp: number
  oldestDataUpdated: string
  oldestDataUpdatedTimestamp: number
  profile: {
    age: number
    birthYear: number
    email: string
    firstName: string
    lastName: string
  }
  regToken: string
  socialProviders: string
}
