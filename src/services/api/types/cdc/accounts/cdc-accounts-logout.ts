import { type CdcApiBaseSuccessResponse } from '../cdc-api-base-success-response'

export type AccountsLogoutRequestParams = {}

export type AccountsLogoutResponse = CdcApiBaseSuccessResponse & {
  connectedProviders: string
  UID: string
  logoutActiveSession: boolean
  samlContext: string
  connectedSamlSessions: string
}
