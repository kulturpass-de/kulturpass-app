import { AppStartListening, ListenerEffect, ListenerEffectMatcherAction } from '../../../redux/listener-middleware'
import { commerceApi } from '../../commerce-api'
import { PENDING_STATUSES } from '../../types/commerce/commerce-get-reservations'
import { apiOfflineCacheActions } from '../api-offline-cache-actions'
import { cacheReservationsProductsDetails } from '../thunks/cache-reservations-products-details'

export const onGetReservationsFulfilledEffect: ListenerEffect<
  ListenerEffectMatcherAction<typeof commerceApi.endpoints.getReservations.matchFulfilled>
> = async (action, listenerApi) => {
  if (!action.payload.orders) {
    return
  }

  const orderHistoryList = action.payload.orders.filter(
    order => order.status && PENDING_STATUSES.includes(order.status),
  )

  listenerApi.dispatch(
    apiOfflineCacheActions.setCommerceApiEndpointCache({
      endpointName: 'getReservations',
      cache: { args: action.meta.arg.originalArgs, payload: { ...action.payload, orders: orderHistoryList } },
    }),
  )

  await listenerApi.dispatch(cacheReservationsProductsDetails(orderHistoryList)).unwrap()
}

export const onGetReservationsFulfilled = (startListening: AppStartListening) =>
  startListening({
    matcher: commerceApi.endpoints.getReservations.matchFulfilled,
    effect: onGetReservationsFulfilledEffect,
  })
