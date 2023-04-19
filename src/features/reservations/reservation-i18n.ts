import { AvailableTranslations } from '../../components/translated-text/types'
import { Order, OrderEntry } from '../../services/api/types/commerce/api-types'

type I18N_KEYS_MAP_TYPE = {
  [key: string]: {
    headline: AvailableTranslations
    copytext: AvailableTranslations
  }
}

const RESERVATION_DETAILS_I18N_KEYS_MAP: I18N_KEYS_MAP_TYPE = {
  CREATED: {
    headline: 'reservationDetail_header_deliveryScenario_pickup_orderStatus_created_headline',
    copytext: 'reservationDetail_header_deliveryScenario_pickup_orderStatus_created_copytext',
  },
  READY_FOR_PICKUP: {
    headline: 'reservationDetail_header_deliveryScenario_pickup_orderStatus_ready_for_pickup_headline',
    copytext: 'reservationDetail_header_deliveryScenario_pickup_orderStatus_ready_for_pickup_copytext',
  },
  READY_FOR_PICKUP_VOUCHER: {
    headline: 'reservationDetail_header_deliveryScenario_pickup_orderStatus_ready_for_pickup_voucher_headline',
    copytext: 'reservationDetail_header_deliveryScenario_pickup_orderStatus_ready_for_pickup_voucher_copytext',
  },
  // TODO: cleanup orderState - received and completed seem to be same usecase
  RECEIVED: {
    headline: 'reservationDetail_header_deliveryScenario_pickup_orderStatus_received_headline',
    copytext: 'reservationDetail_header_deliveryScenario_pickup_orderStatus_received_copytext',
  },
  COMPLETED: {
    headline: 'reservationDetail_header_deliveryScenario_pickup_orderStatus_completed_headline',
    copytext: 'reservationDetail_header_deliveryScenario_pickup_orderStatus_completed_copytext',
  },
  CANCELLED: {
    headline: 'reservationDetail_header_deliveryScenario_pickup_orderStatus_cancelled_headline',
    copytext: 'reservationDetail_header_deliveryScenario_pickup_orderStatus_cancelled_copytext',
  },
  SHIPPING: {
    headline: 'reservationDetail_header_deliveryScenario_pickup_orderStatus_shipping_headline',
    copytext: 'reservationDetail_header_deliveryScenario_pickup_orderStatus_shipping_copytext',
  },
}

export const getReservationOrderTranslations = (orderStatus?: Order['status'], orderEntry?: OrderEntry) => {
  if (!orderStatus) {
    return { headline: undefined, copytext: undefined }
  }

  if (orderStatus === 'READY_FOR_PICKUP' && orderEntry?.voucherCode && orderEntry.voucherIsValid) {
    return RESERVATION_DETAILS_I18N_KEYS_MAP.READY_FOR_PICKUP_VOUCHER
  }

  return RESERVATION_DETAILS_I18N_KEYS_MAP[orderStatus.toUpperCase()]
}
