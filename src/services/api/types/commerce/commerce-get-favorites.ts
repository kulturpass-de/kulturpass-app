import { FavouritesItem } from './api-types'

export type GetFavoritesRequestParams = void

export type GetFavoritesResponse = {
  favouritesItems: FavouritesItem[]
}
