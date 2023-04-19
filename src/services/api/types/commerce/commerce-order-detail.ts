import { Order, User } from './api-types'

export type GetOrderDetailParams = {
  baseSiteId: string
  orderCode: Order['code']
  userId: User['uid']
  // language: string
}

export type GetOrderDetailResponse = Order

export type CancelReservationParams = {
  baseSiteId: string
  userId: User['uid']
  order: Order
}
