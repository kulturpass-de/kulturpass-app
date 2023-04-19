import { CdcApiBaseSuccessResponse } from '../../cdc-api-base-success-response'
import { AccountInfo } from './types'

export type AccountsGetAccountInfoRequestParams = {
  regToken?: string
}

export type AccountsGetAccountInfoResponse = CdcApiBaseSuccessResponse & AccountInfo
