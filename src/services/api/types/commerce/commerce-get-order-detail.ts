import { Order } from './api-types'

export type GetOrderDetailParams = {
  orderCode: Order['code']
}

export type GetOrderDetailResponse = Order
