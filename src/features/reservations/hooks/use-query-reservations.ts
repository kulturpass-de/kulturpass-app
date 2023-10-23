import { useNetInfo } from '@react-native-community/netinfo'
import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useMemo, useState } from 'react'
import { commerceApi } from '../../../services/api/commerce-api'
import { useOfflineReservations } from '../../../services/api/redux/hooks/use-offline-reservations'
import { COMPLETED_STATUSES, PENDING_STATUSES } from '../../../services/api/types/commerce/commerce-get-reservations'
import { ErrorWithCode, OfflineError } from '../../../services/errors/errors'

export const useQueryReservations = () => {
  const { data, refetch: queryRefetch, error: queryError, ...rest } = commerceApi.useGetReservationsQuery({})
  const offlineReservations = useOfflineReservations()
  const netInfo = useNetInfo()
  const [state, setState] = useState<{ customError?: ErrorWithCode }>({})

  const pendingReservations = useMemo(
    () =>
      (data ?? offlineReservations)?.orders?.filter(order => order.status && PENDING_STATUSES.includes(order.status)) ||
      [],
    [data, offlineReservations],
  )

  const completedReservations = useMemo(
    () =>
      (data ?? offlineReservations)?.orders?.filter(
        order => order.status && COMPLETED_STATUSES.includes(order.status),
      ) || [],
    [data, offlineReservations],
  )

  useFocusEffect(
    useCallback(() => {
      queryRefetch()
    }, [queryRefetch]),
  )

  const error = useMemo(() => {
    if (state.customError && !netInfo.isConnected) {
      return state.customError
    }

    if (queryError && netInfo.isConnected) {
      return queryError
    }
  }, [state.customError, netInfo, queryError])

  const refetch = useCallback(async () => {
    if (!netInfo.isConnected) {
      return setState(currentState => ({ ...currentState, customError: new OfflineError() }))
    }

    queryRefetch()
  }, [netInfo, queryRefetch])

  return { ...rest, pendingReservations, completedReservations, refetch, error }
}
