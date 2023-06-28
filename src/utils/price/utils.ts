import { Price } from '../../services/api/types/commerce/api-types'

export type PriceWithValue = Required<Pick<Price, 'value' | 'currencyIso'>>

export const isPriceWithValue = (price?: Price | number): price is PriceWithValue =>
  typeof price === 'object' && typeof price?.value === 'number' && typeof price.currencyIso === 'string'

export const isPriceAsNumber = (price?: Price | number): price is number => typeof price === 'number'
