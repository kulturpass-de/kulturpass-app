import { useMemo } from 'react'
import { store } from '../../../redux/store'

export const useOfflineReservations = (statuses?: string) => {
  return useMemo(
    () => store.getState().persisted.apiOfflineCache.commerceApi.getReservations?.[statuses ?? 'all'],
    [statuses],
  )
}
