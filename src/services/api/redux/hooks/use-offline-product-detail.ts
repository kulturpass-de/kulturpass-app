import { useMemo } from 'react'
import { store } from '../../../redux/store'

export const useOfflineProductDetail = (productCode?: string) => {
  return useMemo(
    () =>
      productCode !== undefined
        ? store.getState().persisted.apiOfflineCache.commerceApi.getProductDetail?.[productCode]
        : undefined,
    [productCode],
  )
}
