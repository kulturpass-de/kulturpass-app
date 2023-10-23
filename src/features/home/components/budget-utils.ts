import { CustomerBalance } from '../../../services/api/types/commerce/api-types'

export type ValidBalance = {
  grantedBalance: number
  availableBalance: number
  reservedBalance: number
}

export const toValidBalance = (balance: CustomerBalance): ValidBalance | undefined => {
  if (
    balance.grantedBalance?.value !== undefined &&
    balance.availableBalance?.value !== undefined &&
    balance.reservedBalance?.value !== undefined
  ) {
    return {
      grantedBalance: balance.grantedBalance.value,
      availableBalance: balance.availableBalance.value,
      reservedBalance: balance.reservedBalance.value,
    }
  }
}
