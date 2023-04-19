export type AccountInfoProfile = {
  email: string
  firstName: string
  lastName: string
}

export type AccountInfoData = {
  preferredPostalCode: string
  preferredProductCategoryId1?: string
  preferredProductCategoryId2?: string
  preferredProductCategoryId3?: string
  preferredProductCategoryId4?: string
}

export type AccountInfo = {
  isRegistered: boolean
  isVerified: boolean
  isActive: boolean
  profile?: AccountInfoProfile
  data?: AccountInfoData
  id_token?: string
  signatureTimestamp?: string
  UID?: string
  UIDSignature?: string
}
