export type PostAuthTokenParams = {
  UID: string
  UIDSignature: string
  signatureTimestamp: number
  id_token: string
}

export type PostAuthTokenResponse = {
  access_token: string
  expires_in: number
  scope: string
  token_type: string
}
