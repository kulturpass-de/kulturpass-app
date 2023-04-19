import { CdcApiBaseSuccessResponse } from '../cdc-api-base-success-response'

export type AccountsInitRegistrationRequestParams = void

export type AccountsInitRegistrationResponse = CdcApiBaseSuccessResponse & {
  regToken: string
}
