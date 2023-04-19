import { Balance } from '../../services/api/types/commerce/api-types'
import { toValidBalance } from './budget-utils'

describe('HomeBudget budget utils', () => {
  test('toValidBalance', () => {
    const balance: Balance = {
      grantedBalance: {
        value: 10,
      },
      availableBalance: {
        value: 3,
      },
      reservedBalance: {
        value: 7,
      },
    }

    const validBalance = toValidBalance(balance)
    expect(validBalance?.grantedBalance).toBe(10)
    expect(validBalance?.availableBalance).toBe(3)
    expect(validBalance?.reservedBalance).toBe(7)

    const emptyBalance: Balance = {
      grantedBalance: {
        value: undefined,
      },
      availableBalance: {
        value: undefined,
      },
      reservedBalance: {
        value: 7,
      },
    }

    const emptyValidBalance = toValidBalance(emptyBalance)
    expect(emptyValidBalance).toBeUndefined()

    const noBalance: Balance = {
      grantedBalance: {
        value: 10,
      },
      availableBalance: {
        value: 10,
      },
      reservedBalance: {
        value: 0,
      },
    }

    const noValidBalance = toValidBalance(noBalance)
    expect(noValidBalance).toBeUndefined()
  })
})
