import { AppStartListening } from '../../../redux/listener-middleware'
import { onGetOrderDetailFulfilled } from './on-get-order-detail-fulfilled'
import { onGetProductDetailFulfilled } from './on-get-product-detail-fulfilled'
import { onGetReservationsFulfilled } from './on-get-reservations-fulfilled'

export const addApiEffects = (startListening: AppStartListening) => {
  onGetOrderDetailFulfilled(startListening)
  onGetProductDetailFulfilled(startListening)
  onGetReservationsFulfilled(startListening)
}
