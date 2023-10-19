import { AppStartListening, ListenerEffect, ListenerEffectMatcherAction } from '../../../redux/listener-middleware'
import { commerceApi } from '../../commerce-api'
import { COMPLETED_STATUSES } from '../../types/commerce/commerce-get-reservations'
import { removeCommerceApiEndpointCache, setCommerceApiEndpointCache } from '../api-offline-cache-slice'

export const onGetOrderDetailFulfilledEffect: ListenerEffect<
  ListenerEffectMatcherAction<typeof commerceApi.endpoints.getOrderDetail.matchFulfilled>
> = async (action, listenerApi) => {
  const orderCode = action.meta.arg.originalArgs.orderCode

  if (!orderCode || !action.payload.status) {
    return
  }
  if (COMPLETED_STATUSES.includes(action.payload.status)) {
    listenerApi.dispatch(
      removeCommerceApiEndpointCache({
        endpointName: 'getOrderDetail',
        cacheKey: orderCode,
      }),
    )
    return
  }

  listenerApi.dispatch(
    setCommerceApiEndpointCache({
      endpointName: 'getOrderDetail',
      cacheKey: orderCode,
      payload: action.payload,
    }),
  )
}

export const onGetOrderDetailFulfilled = (startListening: AppStartListening) =>
  startListening({
    matcher: commerceApi.endpoints.getOrderDetail.matchFulfilled,
    effect: onGetOrderDetailFulfilledEffect,
  })
