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
  RECEIVED: {
    headline: 'reservationDetail_header_deliveryScenario_pickup_orderStatus_completed_headline',
    copytext: 'reservationDetail_header_deliveryScenario_pickup_orderStatus_completed_copytext',
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

  const { fulfillmentOption } = productDetail

  if (orderStatus === 'READY_FOR_PICKUP') {
    if (fulfillmentOption === 'REDEMPTION_CODE') {
      return RESERVATION_DETAILS_I18N_KEYS_MAP.READY_FOR_PICKUP_REQUIRED_VOUCHER
    } else if (fulfillmentOption === 'PICKUP_CODE') {
      return RESERVATION_DETAILS_I18N_KEYS_MAP.READY_FOR_PICKUP
    } else if (fulfillmentOption === 'VENDOR_CODE') {
      return RESERVATION_DETAILS_I18N_KEYS_MAP.READY_FOR_PICKUP_NOT_REQUIRED_VOUCHER
    }
  }

  if (
    (productDetail.productType === ProductTypes.Voucher ||
      fulfillmentOption === 'REDEMPTION_CODE' ||
      fulfillmentOption === 'VENDOR_CODE') &&
    (orderStatus === 'RECEIVED' || orderStatus === 'COMPLETED')
  ) {
    return RESERVATION_DETAILS_I18N_KEYS_MAP.RECEIVED_VOUCHER
  }

  return RESERVATION_DETAILS_I18N_KEYS_MAP[orderStatus.toUpperCase()]
}
