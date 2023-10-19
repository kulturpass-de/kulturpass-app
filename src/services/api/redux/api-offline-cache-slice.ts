import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ApiOfflineCacheState } from '../../redux/versions/current'
import {
  CommerceApiEndpointName,
  RemoveCommerceApiEndpointCachePayload,
  SetCommerceApiEndpointCachePayload,
} from './types'

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
      const { endpointName, payload, cacheKey } = action.payload

      return {
        ...state,
        commerceApi: {
          ...state.commerceApi,
          [endpointName]: {
            ...(state.commerceApi[endpointName] || {}),
            [cacheKey]: payload,
          },
        },
      }
    },
    removeCommerceApiEndpointCache: (
      state,
      action: PayloadAction<RemoveCommerceApiEndpointCachePayload<CommerceApiEndpointName>>,
    ) => {
      const { endpointName, cacheKey } = action.payload
      return {
        ...state,
        commerceApi: {
          ...state.commerceApi,
          [endpointName]: {
            ...(state.commerceApi[endpointName] || {}),
            [cacheKey]: undefined,
          },
        },
      }
    },
    resetCommerceApiCache: state => {
      return {
        ...state,
        commerceApi: {},
      }
    },
  },
})

export const { resetCommerceApiCache, setCommerceApiEndpointCache, removeCommerceApiEndpointCache } =
  apiOfflineCacheSlice.actions
