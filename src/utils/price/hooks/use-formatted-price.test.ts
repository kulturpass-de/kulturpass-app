import { renderHook } from '@testing-library/react-native'
import { Price } from '../../../services/api/types/commerce/api-types'
import { useFormattedPrice } from './use-formatted-price'
import { I18nProvider } from '../../../services/testing/test-utils'
import i18next from 'i18next'

describe('useFormattedPrice', () => {
  beforeEach(() => {
    i18next.language = 'de'
  })

  test('Should return formatted EUR price', () => {
    const price: Price = {
      value: 20,
      currencyIso: 'EUR',
    }
    const { result } = renderHook(() => useFormattedPrice(price), {
      wrapper: I18nProvider,
    })

    expect(result.current).toMatch(/20,00\s€/)
  })

  test('Should return undefined', () => {
    const price: Price = {
      value: undefined,
      currencyIso: 'EUR',
    }
    const { result } = renderHook(() => useFormattedPrice(price), {
      wrapper: I18nProvider,
    })
    expect(result.current).toBeUndefined()
  })
})
