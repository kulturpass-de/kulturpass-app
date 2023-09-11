import { AppStartListening, ListenerEffect, ListenerEffectMatcherAction } from '../../../redux/listener-middleware'
import { commerceApi } from '../../commerce-api'
import { apiOfflineCacheActions } from '../api-offline-cache-actions'

export const onGetProductDetailFulfilledEffect: ListenerEffect<
  ListenerEffectMatcherAction<typeof commerceApi.endpoints.getProductDetail.matchFulfilled>
> = async (action, listenerApi) => {
  listenerApi.dispatch(
    apiOfflineCacheActions.setCommerceApiEndpointCache({
      endpointName: 'getProductDetail',
      cache: { args: action.meta.arg.originalArgs, payload: action.payload },
    }),
  )
}

export const onGetProductDetailFulfilled = (startListening: AppStartListening) =>
  startListening({
    matcher: commerceApi.endpoints.getProductDetail.matchFulfilled,
    effect: onGetProductDetailFulfilledEffect,
  })
