import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useMemo } from 'react'

import { commerceApi } from '../../../services/api/commerce-api'
import {
  ORDER_STATUS_CANCELLING,
  ORDER_STATUS_CANCELLED,
  ORDER_STATUS_COMPLETED,
  ORDER_STATUS_CREATED,
  ORDER_STATUS_READY_FOR_PICKUP,
  ORDER_STATUS_RECEIVED,
  ORDER_STATUS_SHIPPING,
} from '../../../services/api/types/commerce/commerce-get-reservations'

const PENDING_STATUSES = [ORDER_STATUS_CREATED, ORDER_STATUS_SHIPPING, ORDER_STATUS_READY_FOR_PICKUP]
const COMPLETED_STATUSES = [
  ORDER_STATUS_RECEIVED,
  ORDER_STATUS_COMPLETED,
  ORDER_STATUS_CANCELLING,
  ORDER_STATUS_CANCELLED,
]

export const useQueryReservations = () => {
  const { data, refetch, ...rest } = commerceApi.useGetReservationsQuery({})

  const pendingReservations = useMemo(
    () => data?.orders?.filter(order => order.status && PENDING_STATUSES.includes(order.status)) || [],
    [data],
  )

  const completedReservations = useMemo(
    () => data?.orders?.filter(order => order.status && COMPLETED_STATUSES.includes(order.status)) || [],
    [data],
  )

  useFocusEffect(
    useCallback(() => {
      refetch()
    }, [refetch]),
  )

  return { ...rest, pendingReservations, completedReservations, refetch }
}
