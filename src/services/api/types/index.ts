export type ApiConfig = {
  baseUrl: string
  baseSiteId?: string
  apiKey?: string
  auth?: {
    tokenEndpoint: string
    clientId: string
    clientSecret: string
  }
}

// CDC

export type CdcApiErrorResponse = {
  apiVersion: number
  callId: string
  errorCode: number
  errorDetails: string
  errorMessage: string
  statusCode: number
  statusReason: string
  time: string
}

export * from './cdc/accounts/cdc-accounts-init-registration'
export * from './cdc/accounts/cdc-accounts-register'
export * from './cdc/accounts/cdc-accounts-login'
export * from './cdc/accounts/cdc-accounts-account-info'

// commerce

export * from './commerce/commerce-auth'
export * from './commerce/commerce-favorites'
export * from './commerce/commerce-preferences'
export * from './commerce/commerce-product-detail'
