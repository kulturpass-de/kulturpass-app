import { useEffect } from 'react'
import { commerceApi } from '../../../services/api/commerce-api'
import { GetProductDetailParams } from '../../../services/api/types'

export const useQueryProductDetail = (productCode?: string, offersByLocation?: GetProductDetailParams['location']) => {
  const [queryTrigger, queryResult] = commerceApi.useLazyGetProductDetailQuery()

  useEffect(() => {
    if (productCode) {
      queryTrigger({ productCode, location: offersByLocation })
    }
  }, [queryTrigger, productCode, offersByLocation])

  return queryResult
}
