import React from 'react'
import { SvgImage, SvgImageProps } from '../../../components/svg-image/svg-image'
import { Order } from '../../../services/api/types/commerce/api-types'
import { buildTestId } from '../../../services/test-id/test-id'

const OrderStatusSvg: Record<string, SvgImageProps['type']> = {
  CREATED: 'hourglass',
  SHIPPING: 'hourglass-tilted',
  // 'READY_FOR_PICKUP': null,
  RECEIVED: 'order-redeemed',
  COMPLETED: 'order-redeemed',
  CANCELLING: 'cross-circle-red',
  CANCELLED: 'cross-circle-red',
}

type ReservationDetailStatusImageProps = {
  order: Order
}

export const ReservationDetailStatusImage: React.FC<ReservationDetailStatusImageProps> = ({ order }) => {
  const orderStatus = order.status
  const svgImageType = orderStatus && OrderStatusSvg[orderStatus] ? OrderStatusSvg[orderStatus] : null

  if (!svgImageType) {
    return null
  }

  return (
    <SvgImage
      testID={buildTestId('reservationDetail_header_voucherScenario_pickup_voucherSection_image')}
      type={svgImageType}
      height={87}
      width={87}
    />
  )
}
