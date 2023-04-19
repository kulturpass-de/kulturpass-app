export type CommerceAuthParams = {
  url: string
  client_id: string
  client_secret: string
  grant_type: 'custom'
  UID: string
  UIDSignature: string
  signatureTimestamp: number
  id_token: string
  baseSite: string
}

export type CommerceAuthResponse = {
  access_token: string
  expires_in: number
  scope: string
  token_type: string
}
