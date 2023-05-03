import { Cart } from './api-types'

export type GetFavoritesRequestParams = void

export type GetFavoritesResponse = {
  carts: Cart[]
}
