import { AppStartListening, ListenerEffect, ListenerEffectMatcherAction } from '../../../redux/listener-middleware'
import { commerceApi } from '../../commerce-api'
import { COMPLETED_STATUSES } from '../../types/commerce/commerce-get-reservations'
import { apiOfflineCacheActions } from '../api-offline-cache-actions'

export const onGetOrderDetailFulfilledEffect: ListenerEffect<
  ListenerEffectMatcherAction<typeof commerceApi.endpoints.getOrderDetail.matchFulfilled>
> = async (action, listenerApi) => {
  if (!action.payload.status || COMPLETED_STATUSES.includes(action.payload.status)) {
    return
  }

  listenerApi.dispatch(
    apiOfflineCacheActions.setCommerceApiEndpointCache({
      endpointName: 'getOrderDetail',
      cache: { args: action.meta.arg.originalArgs, payload: action.payload },
    }),
  )
}

export const onGetOrderDetailFulfilled = (startListening: AppStartListening) =>
  startListening({
    matcher: commerceApi.endpoints.getOrderDetail.matchFulfilled,
    effect: onGetOrderDetailFulfilledEffect,
  })
