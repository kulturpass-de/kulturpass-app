import { useEffect } from 'react'
import { commerceApi } from '../../../services/api/commerce-api'

export const useQueryProductDetail = (productCode?: string) => {
  const [queryTrigger, queryResult] = commerceApi.useLazyGetProductDetailQuery()

  useEffect(() => {
    if (productCode) {
      queryTrigger({ productCode })
    }
  }, [queryTrigger, productCode])

  return queryResult
}
