import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ApiOfflineCacheState } from '../../redux/versions/current'
import { CommerceApiEndpointName, SetCommerceApiEndpointCachePayload } from './types'

export const initialState: ApiOfflineCacheState = {
  commerceApi: {},
}

export const apiOfflineCacheSlice = createSlice({
  name: 'apiOfflineCache',
  initialState: initialState,
  reducers: {
    setCommerceApiEndpointCache: (
      state,
      action: PayloadAction<SetCommerceApiEndpointCachePayload<CommerceApiEndpointName>>,
    ) => {
      const { endpointName, cache } = action.payload

      const cacheKey = JSON.stringify(cache.args)

      return {
        ...state,
        commerceApi: {
          ...state.commerceApi,
          [endpointName]: {
            ...(state.commerceApi[endpointName] || {}),
            [cacheKey]: cache,
          },
        },
      }
    },
    clearCommerceApiEndpointCache: (state, action: PayloadAction<{ endpointName: CommerceApiEndpointName }>) => {
      const { endpointName } = action.payload

      return {
        ...state,
        commerceApi: {
          ...state.commerceApi,
          [endpointName]: {},
        },
      }
    },
  },
})
