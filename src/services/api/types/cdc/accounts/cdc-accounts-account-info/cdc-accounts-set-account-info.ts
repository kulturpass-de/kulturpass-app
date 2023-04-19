import { CdcApiBaseSuccessResponse } from '../../cdc-api-base-success-response'
import { AccountInfoData, AccountInfoProfile } from './types'

export type AccountsSetAccountInfoRequestParams = {
  regToken?: string
  profile?: AccountInfoProfile
  data?: AccountInfoData
}

export type AccountsSetAccountInfoResponse = CdcApiBaseSuccessResponse
