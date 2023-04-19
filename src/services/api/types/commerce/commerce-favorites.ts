import { Cart } from './api-types'

export type GetFavoritesRequestParams = {
  baseSiteId: string
}

export type GetFavoritesResponse = {
  carts: Cart[]
}
