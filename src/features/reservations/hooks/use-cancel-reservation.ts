import { useSelector } from 'react-redux'
import { commerceApi } from '../../../services/api/commerce-api'
import { Order, User } from '../../../services/api/types/commerce/api-types'
import { getCommerceBaseSiteId } from '../../../services/environment-configuration/redux/environment-configuration-selectors'

export const useCancelReservation = (order: Order, userId: User['uid'] = 'current') => {
  const baseSiteId = useSelector(getCommerceBaseSiteId)
  const [mutate] = commerceApi.endpoints.cancelReservation.useMutation()

  return () => {
    return mutate({ baseSiteId, userId, order })
  }
}
