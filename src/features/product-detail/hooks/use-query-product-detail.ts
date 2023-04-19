import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { commerceApi } from '../../../services/api/commerce-api'
import { getCommerceBaseSiteId } from '../../../services/environment-configuration/redux/environment-configuration-selectors'
import { getCurrentUserLocation } from '../../../services/location/redux/location-selectors'
import { useTranslation } from '../../../services/translation/translation'
import { useUserInfo } from '../../../services/user/use-user-info'

export const useQueryProductDetail = (productCode?: string) => {
  const { l: language } = useTranslation()
  const location = useSelector(getCurrentUserLocation)
  const baseSiteId = useSelector(getCommerceBaseSiteId)
  const { userPreferences } = useUserInfo()
  const preferredPostalCode = userPreferences?.preferredPostalCode

  const [queryTrigger, queryResult] = commerceApi.endpoints.getProductDetail.useLazyQuery()

  useEffect(() => {
    if (productCode) {
      queryTrigger({ baseSiteId, productCode, language, location, preferredPostalCode })
    }
  }, [queryTrigger, baseSiteId, productCode, language, location, preferredPostalCode])

  return queryResult
}
