import React, { useCallback } from 'react'
import { LoadingIndicator } from '../../../components/loading-indicator/loading-indicator'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { PdpScreenProps } from '../../../navigation/pdp/types'
import { createRouteConfig } from '../../../navigation/utils/createRouteConfig'
import { commerceApi } from '../../../services/api/commerce-api'
import { Order } from '../../../services/api/types/commerce/api-types'
import { modalCardStyle } from '../../../theme/utils'
import { useQueryProductDetail } from '../../product-detail/hooks/use-query-product-detail'
import { ReservationDetailScreen } from './reservation-detail-screen'

export const ReservationDetailRouteName = 'ReservationDetail'

export type ReservationDetailRouteParams = {
  orderCode: NonNullable<Order['code']>
  completedReservation?: boolean
}

type ReservationDetailProps = PdpScreenProps<'ReservationDetail'>

export const ReservationDetailRoute: React.FC<ReservationDetailProps> = ({ route }) => {
  const modalNavigation = useModalNavigation()

  const { orderCode, completedReservation } = route.params
  const orderDetailResponse = commerceApi.useGetOrderDetailQuery({ orderCode }, { refetchOnMountOrArgChange: true })
  const order = orderDetailResponse.data
  const orderEntry = order?.entries?.[0]

  const { data: productDetail, isLoading } = useQueryProductDetail(orderEntry?.product?.code)

  const onClose = useCallback(() => {
    modalNavigation.closeModal()
  }, [modalNavigation])

  const afterCancelReservationTriggered = useCallback(() => {
    modalNavigation.closeModal()
  }, [modalNavigation])

  if (!order || !orderEntry?.product?.code || !orderEntry?.offerId) {
    return null
  }

  return (
    <>
      <LoadingIndicator loading={isLoading || orderDetailResponse.isLoading} />
      <ReservationDetailScreen
        productDetail={productDetail}
        order={order}
        onClose={onClose}
        afterCancelReservationTriggered={afterCancelReservationTriggered}
        completedReservation={completedReservation}
      />
    </>
  )
}

export const ReservationDetailRouteConfig = createRouteConfig({
  name: ReservationDetailRouteName,
  component: ReservationDetailRoute,
  options: { cardStyle: modalCardStyle },
})
