import { logger } from '../../../logger'
import { createThunk } from '../../../redux/utils/create-thunk'
import { commerceApi } from '../../commerce-api'
import { selectApiOfflineCacheEndpointState } from '../api-offline-cache-selectors'

export const rehydrateCommerceApiCache = createThunk<void, void>(
  'apiOfflineCache/rehydrateCommerceApiCache',
  async (payload, thunkApi) => {
    const state = thunkApi.getState()

    const commerceApiCacheEndpointNames = ['getOrderDetail', 'getProductDetail', 'getReservations'] as const

    const promises = commerceApiCacheEndpointNames.reduce<Promise<any>[]>((promisesAcc, endpointName) => {
      const caches = selectApiOfflineCacheEndpointState(state, endpointName)

      const endpointPromises = caches.map(cache => {
        logger.log('apiOfflineCache/rehydrateCommerceApiCache', endpointName, cache.args)

        return thunkApi.dispatch(commerceApi.util.upsertQueryData(endpointName, cache.args, cache.payload)).unwrap()
      })

      return [...promisesAcc, ...endpointPromises]
    }, [])

    await Promise.all(promises)
  },
)
