import { useMemo } from 'react'
import { store } from '../../../redux/store'

export const useOfflineOrderDetail = (orderCode?: string) => {
  return useMemo(
    () =>
      orderCode !== undefined
        ? store.getState().persisted.apiOfflineCache.commerceApi.getOrderDetail?.[orderCode]
        : undefined,
    [orderCode],
  )
}
