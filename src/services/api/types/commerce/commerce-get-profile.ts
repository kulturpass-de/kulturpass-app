import { Price } from './api-types'

export type Profile = {
  firstName: string
  name: string
  balance: {
    availableBalance?: Price
    grantedBalance?: Price
    reservedBalance?: Price
  }
  identificationStatus: 'DUPLICATE' | 'VERIFIED' | 'NOT_VERIFIED'
  balanceStatus: 'ENTITLED' | 'NOT_ENTITLED' | 'NOT_YET_ENTITLED'
}

export type GetProfileRequestParams = {
  forceUpdate?: boolean
}

export type GetProfileResponseBody = Profile
