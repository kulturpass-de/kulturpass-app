import { useMemo } from 'react'
import { Price } from '../../../services/api/types/commerce/api-types'
import { useTranslation } from '../../../services/translation/translation'
import { isPriceAsNumber, isPriceWithValue } from '../utils'

export const useFormattedPrice = (price?: Price | number) => {
  const { l } = useTranslation()

  const formattedPrice: string | undefined = useMemo(() => {
    if (isPriceWithValue(price)) {
      return new Intl.NumberFormat(l, { style: 'currency', currency: price.currencyIso }).format(price.value)
    } else if (isPriceAsNumber(price)) {
      return new Intl.NumberFormat(l, { style: 'currency', currency: 'EUR' }).format(price)
    } else {
      return undefined
    }
  }, [l, price])

  return formattedPrice
}
