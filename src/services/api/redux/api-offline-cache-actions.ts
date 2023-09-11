import { apiOfflineCacheSlice } from './api-offline-cache-slice'
import { CommerceApiEndpointName, SetCommerceApiEndpointCachePayload } from './types'

export const apiOfflineCacheActions = {
  setCommerceApiEndpointCache: <endpointName extends CommerceApiEndpointName>(
    params: SetCommerceApiEndpointCachePayload<endpointName>,
  ) => apiOfflineCacheSlice.actions.setCommerceApiEndpointCache(params),
  clearCommerceApiEndpointCache: apiOfflineCacheSlice.actions.clearCommerceApiEndpointCache,
}
