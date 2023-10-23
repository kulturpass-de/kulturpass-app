export type CdcSessionData = {
  sessionToken?: string
  sessionSecret?: string
  sessionStartTimestamp: number
  idToken: string
  sessionValidity: number
  user: {
    firstName?: string
    email: string
  }
  uid: string
  uidSignature: string
  regToken?: string
  isVerified: boolean
}

export type CommerceSessionData = {
  access_token: string
  expires_in: number
  scope: string
  token_type: string
  token_valid_until?: number
}
