import { Price } from '../../services/api/types/commerce/api-types'

export type PriceWithValue = Required<Pick<Price, 'value' | 'currencyIso'>>

export const isPriceWithValue = (price?: Price): price is PriceWithValue =>
  typeof price?.value === 'number' && typeof price.currencyIso === 'string'
