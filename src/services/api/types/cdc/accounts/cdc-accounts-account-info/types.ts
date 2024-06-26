export type AccountInfoProfile = {
  email: string
  firstName?: string
}

export type AccountInfoDataEid = {
  dateOfBirth: string // format YYYY-MM-DD
}

export type AccountSubscriptionsData = {
  editorialInformation?: {
    email?: {
      isSubscribed?: boolean
    }
  }
}

export type AccountInfoData = {
  preferredPostalCode?: string
  preferredProductCategoryId1?: string
  preferredProductCategoryId2?: string
  preferredProductCategoryId3?: string
  preferredProductCategoryId4?: string
  eid?: AccountInfoDataEid
  idVerified?: 'true'
  dateOfBirth?: string | null // format YYYY-MM-DD
  deletionRequested?: boolean
  subscriptions?: AccountSubscriptionsData
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
  subscriptions?: AccountSubscriptionsData
}
