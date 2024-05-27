import { CdcApiBaseSuccessResponse } from '../../cdc-api-base-success-response'
import { AccountInfoData, AccountInfoProfile, AccountSubscriptionsData } from './types'

export type AccountsSetAccountInfoWithRegTokenUnsignedRequestParams = {
  subscriptions?: AccountSubscriptionsData
  profile?: AccountInfoProfile
  data?: AccountInfoData
  password?: string
  newPassword?: string
  regToken: string
}

export type AccountsSetAccountInfoSignedRequestParams = {
  subscriptions?: AccountSubscriptionsData
  profile?: AccountInfoProfile
  data?: AccountInfoData
  password?: string
  newPassword?: string
}

export type AccountsSetAccountInfoWithCustomSessionSignedRequestParams = {
  profile?: AccountInfoProfile
  data?: AccountInfoData
  password?: string
  newPassword?: string
  sessionToken: string
  sessionSecret: string
}

export type AccountsSetAccountInfoResponse = CdcApiBaseSuccessResponse
