import { Balance } from '../../services/api/types/commerce/api-types'

type ValidBalance = {
  grantedBalance: number
  availableBalance: number
  reservedBalance: number
}

export const toValidBalance = (balance: Balance): ValidBalance | undefined => {
  if (
    balance.grantedBalance?.value !== undefined &&
    balance.availableBalance?.value !== undefined &&
    balance.reservedBalance?.value !== undefined &&
    balance.reservedBalance.value > 0
  ) {
    return {
      grantedBalance: balance.grantedBalance.value,
      availableBalance: balance.availableBalance.value,
      reservedBalance: balance.reservedBalance.value,
    }
  }
}
