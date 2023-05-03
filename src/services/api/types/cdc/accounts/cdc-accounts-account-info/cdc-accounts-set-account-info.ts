import { CdcApiBaseSuccessResponse } from '../../cdc-api-base-success-response'
import { AccountInfoData, AccountInfoDeletionData, AccountInfoProfile } from './types'

export type AccountsSetAccountInfoWithRegTokenUnsignedRequestParams = {
  profile?: AccountInfoProfile
  data?: AccountInfoData
  password?: string
  newPassword?: string
  regToken: string
}

export type AccountsSetAccountInfoSignedRequestParams = {
  profile?: AccountInfoProfile
  data?: AccountInfoData
  password?: string
  newPassword?: string
}

export type AccountsSetAccountInfoWithCustomSessionSignedRequestParams = {
  profile?: AccountInfoProfile
  data?: AccountInfoDeletionData
  password?: string
  newPassword?: string
  sessionToken: string
  sessionSecret: string
}

export type AccountsSetAccountInfoResponse = CdcApiBaseSuccessResponse
