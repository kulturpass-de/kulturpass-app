import { useSelector } from 'react-redux'

import { getCommerceBaseSiteId } from '../../../services/environment-configuration/redux/environment-configuration-selectors'
import { useTranslation } from '../../../services/translation/translation'
import { commerceApi } from '../../../services/api/commerce-api'

export const usePreferenceCategories = () => {
  const baseSiteId = useSelector(getCommerceBaseSiteId)
  const { l: lang } = useTranslation()
  return commerceApi.endpoints.getPreferenceCategories.useQuery({ baseSiteId, lang })
}
