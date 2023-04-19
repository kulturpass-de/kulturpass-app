import React, { useCallback } from 'react'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { ModalScreenProps } from '../../../navigation/modal/types'

import { createRouteConfig } from '../../../navigation/utils/createRouteConfig'
import { Order } from '../../../services/api/types/commerce/api-types'
import { modalCardStyle } from '../../../theme/utils'
import { useOrderDetail } from '../hooks/use-order-detail'
import { ReservationDetailScreen } from './reservation-detail-screen'
import { useQueryProductDetail } from '../../product-detail/hooks/use-query-product-detail'
import { useSelectedOrClosestOffer } from '../../product-detail/hooks/use-selected-or-closest-offer'

export const ReservationDetailRouteName = 'ReservationDetail'

export type ReservationDetailRouteParams = {
  orderCode: NonNullable<Order['code']>
}

type ReservationDetailProps = ModalScreenProps<'ReservationDetail'>

export const ReservationDetailRoute: React.FC<ReservationDetailProps> = ({ route }) => {
  const modalNavigation = useModalNavigation()

  const { orderCode } = route.params
  const orderDetailResponse = useOrderDetail(orderCode)
  const order = orderDetailResponse.data
  const orderEntry = order?.entries?.[0]

  const { data: productDetail } = useQueryProductDetail(orderEntry?.product?.code)
  const selectedOffer = useSelectedOrClosestOffer(productDetail, orderEntry?.offerId)

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
    <ReservationDetailScreen
      productDetail={productDetail}
      selectedOffer={selectedOffer}
      order={order}
      onClose={onClose}
      afterCancelReservationTriggered={afterCancelReservationTriggered}
    />
  )
}

export const ReservationDetailRouteConfig = createRouteConfig({
  name: ReservationDetailRouteName,
  component: ReservationDetailRoute,
  options: { cardStyle: modalCardStyle },
})
