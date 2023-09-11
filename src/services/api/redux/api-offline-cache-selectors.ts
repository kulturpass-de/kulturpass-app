import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '../../redux/configure-store'
import { CommerceApiEndpointCache, CommerceApiEndpointName } from './types'

export const selectApiOfflineCacheState = (state: RootState) => state.persisted.apiOfflineCache

const selectApiOfflineCacheEndpointStateUntyped = createSelector(
  [selectApiOfflineCacheState, (state, endpointName: CommerceApiEndpointName) => endpointName],
  (apiOfflineCacheState, endpointName) => Object.values(apiOfflineCacheState.commerceApi[endpointName] || {}),
)

export const selectApiOfflineCacheEndpointState = <commerceApiEndpointName extends CommerceApiEndpointName>(
  state: RootState,
  endpointName: commerceApiEndpointName,
): CommerceApiEndpointCache<commerceApiEndpointName>[] => selectApiOfflineCacheEndpointStateUntyped(state, endpointName)
