import { OrderHistoryList } from './api-types'

export const DELIVERY_SCENARIO_PICKUP = 'PICKUP'
export const DELIVERY_SCENARIO_IN_APP_VOUCHER = 'IN_APP_VOUCHER'

export const ORDER_STATUS_RECEIVED = 'RECEIVED'
export const ORDER_STATUS_COMPLETED = 'COMPLETED'
export const ORDER_STATUS_CANCELLED = 'CANCELLED'
export const ORDER_STATUS_READY_FOR_PICKUP = 'READY_FOR_PICKUP'
export const ORDER_STATUS_SHIPPING = 'SHIPPING'
export const ORDER_STATUS_CREATED = 'CREATED'

export type GetReservationsParams = {
  statuses?: string
  //TODO: Add fields, pageSize, sort (API not ready at time of implementation)
}

export type GetReservationsResponse = OrderHistoryList
