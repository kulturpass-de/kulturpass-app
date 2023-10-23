import { AvailableTranslations } from '../../components/translated-text/types'
import { Order } from '../../services/api/types/commerce/api-types'
import { ProductDetail, ProductTypes } from '../product-detail/types/product-detail'

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
  READY_FOR_PICKUP_REQUIRED_VOUCHER: {
    headline: 'reservationDetail_header_deliveryScenario_pickup_orderStatus_ready_for_pickupRequired_voucher_headline',
    copytext: 'reservationDetail_header_deliveryScenario_pickup_orderStatus_ready_for_pickupRequired_voucher_copytext',
  },
  READY_FOR_PICKUP_NOT_REQUIRED_VOUCHER: {
    headline:
      'reservationDetail_header_deliveryScenario_pickup_orderStatus_ready_for_pickupNotRequired_voucher_headline',
    copytext:
      'reservationDetail_header_deliveryScenario_pickup_orderStatus_ready_for_pickupNotRequired_voucher_copytext',
  },
  RECEIVED_VOUCHER: {
    headline: 'reservationDetail_header_deliveryScenario_pickup_orderStatus_received_pickupNotRequired_headline',
    copytext: 'reservationDetail_header_deliveryScenario_pickup_orderStatus_received_pickupNotRequired_copytext',
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
  CANCELLING: {
    headline: 'reservationDetail_header_deliveryScenario_pickup_orderStatus_cancelled_headline',
    copytext: 'reservationDetail_header_deliveryScenario_pickup_orderStatus_cancelled_copytext',
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

export const getReservationOrderTranslations = (productDetail: ProductDetail, orderStatus?: Order['status']) => {
  if (!orderStatus) {
    return { headline: undefined, copytext: undefined }
  }

  if (productDetail.productType === ProductTypes.Voucher && orderStatus === 'READY_FOR_PICKUP') {
    if (productDetail.isVoucherPickupRequired) {
      return RESERVATION_DETAILS_I18N_KEYS_MAP.READY_FOR_PICKUP_REQUIRED_VOUCHER
    } else {
      return RESERVATION_DETAILS_I18N_KEYS_MAP.READY_FOR_PICKUP_NOT_REQUIRED_VOUCHER
    }
  }

  if (
    productDetail.productType === ProductTypes.Voucher &&
    (orderStatus === 'RECEIVED' || orderStatus === 'COMPLETED')
  ) {
    return RESERVATION_DETAILS_I18N_KEYS_MAP.RECEIVED_VOUCHER
  }

  return RESERVATION_DETAILS_I18N_KEYS_MAP[orderStatus.toUpperCase()]
}
