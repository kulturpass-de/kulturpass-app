import { OrderHistoryList } from './api-types'

export const DELIVERY_SCENARIO_PICKUP = 'PICKUP'
export const DELIVERY_SCENARIO_IN_APP_VOUCHER = 'IN_APP_VOUCHER'

export const ORDER_STATUS_RECEIVED = 'RECEIVED'
export const ORDER_STATUS_COMPLETED = 'COMPLETED'
export const ORDER_STATUS_CANCELLING = 'CANCELLING'
export const ORDER_STATUS_CANCELLED = 'CANCELLED'
export const ORDER_STATUS_READY_FOR_PICKUP = 'READY_FOR_PICKUP'
export const ORDER_STATUS_SHIPPING = 'SHIPPING'
export const ORDER_STATUS_CREATED = 'CREATED'

export const PENDING_STATUSES = [ORDER_STATUS_CREATED, ORDER_STATUS_SHIPPING, ORDER_STATUS_READY_FOR_PICKUP]
export const COMPLETED_STATUSES = [
  ORDER_STATUS_RECEIVED,
  ORDER_STATUS_COMPLETED,
  ORDER_STATUS_CANCELLING,
  ORDER_STATUS_CANCELLED,
]

export type GetReservationsParams = {
  statuses?: string
  //TODO: Add fields, pageSize, sort (API not ready at time of implementation)
}

export type GetReservationsResponse = OrderHistoryList
