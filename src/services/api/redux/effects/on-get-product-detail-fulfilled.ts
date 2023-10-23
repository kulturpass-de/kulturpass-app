import { AppStartListening, ListenerEffect, ListenerEffectMatcherAction } from '../../../redux/listener-middleware'
import { commerceApi } from '../../commerce-api'
import { setCommerceApiEndpointCache } from '../api-offline-cache-slice'

export const onGetProductDetailFulfilledEffect: ListenerEffect<
  ListenerEffectMatcherAction<typeof commerceApi.endpoints.getProductDetail.matchFulfilled>
> = async (action, listenerApi) => {
  const productCode = action.meta.arg.originalArgs.productCode
  listenerApi.dispatch(
    setCommerceApiEndpointCache({
      endpointName: 'getProductDetail',
      cacheKey: productCode,
      payload: action.payload,
    }),
  )
}

export const onGetProductDetailFulfilled = (startListening: AppStartListening) =>
  startListening({
    matcher: commerceApi.endpoints.getProductDetail.matchFulfilled,
    effect: onGetProductDetailFulfilledEffect,
  })
