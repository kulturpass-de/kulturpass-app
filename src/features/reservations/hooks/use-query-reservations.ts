import { useFocusEffect } from '@react-navigation/native'
import { useCallback } from 'react'
import { useSelector } from 'react-redux'

import { commerceApi } from '../../../services/api/commerce-api'
import { getCommerceBaseSiteId } from '../../../services/environment-configuration/redux/environment-configuration-selectors'
import {
  ORDER_STATUS_CANCELLED,
  ORDER_STATUS_COMPLETED,
  ORDER_STATUS_CREATED,
  ORDER_STATUS_READY_FOR_PICKUP,
  ORDER_STATUS_RECEIVED,
  ORDER_STATUS_SHIPPING,
} from '../../../services/api/types/commerce/commerce-reservations'

const PENDING_STATUSES = [ORDER_STATUS_CREATED, ORDER_STATUS_SHIPPING, ORDER_STATUS_READY_FOR_PICKUP].join(',')
const COMPLETED_STATUSES = [ORDER_STATUS_RECEIVED, ORDER_STATUS_COMPLETED, ORDER_STATUS_CANCELLED].join(',')

export const useQueryReservations = (completed: boolean) => {
  const baseSiteId = useSelector(getCommerceBaseSiteId)
  const {
    data: orderEntryList,
    isLoading,
    error,
    refetch,
  } = commerceApi.endpoints.getReservations.useQuery({
    baseSiteId,
    statuses: completed ? COMPLETED_STATUSES : PENDING_STATUSES,
  })

  useFocusEffect(
    useCallback(() => {
      refetch()
    }, [refetch]),
  )

  return { orderEntryList, isLoading, error, refetch }
}
