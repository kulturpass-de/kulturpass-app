import { CompositeScreenProps } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import {
  OfferSelectionFilterRouteName,
  OfferSelectionFilterRouteParams,
} from '../../screens/product-details/offer-selection-filter-route'
import { OfferSelectionRouteName, OfferSelectionRouteParams } from '../../screens/product-details/offer-selection-route'
import {
  ProductConfirmReservationRouteName,
  ProductConfirmReservationRouteParams,
} from '../../screens/product-details/product-confirm-reservation-route'
import { ProductDetailRouteName, ProductDetailRouteParams } from '../../screens/product-details/product-detail-route'
import { ProductReportRouteName, ProductReportRouteParams } from '../../screens/product-details/product-report-route'
import { OrderReportRouteName, OrderReportRouteParams } from '../../screens/reservations/order-report-route'
import {
  ReservationDetailRouteName,
  ReservationDetailRouteParams,
} from '../../screens/reservations/reservation-detail-route'
import { RootStackParams } from '../types'

export type PdpParamList = {
  [ProductDetailRouteName]: ProductDetailRouteParams
  [OfferSelectionRouteName]: OfferSelectionRouteParams
  [OfferSelectionFilterRouteName]: OfferSelectionFilterRouteParams
  [ProductConfirmReservationRouteName]: ProductConfirmReservationRouteParams
  [ReservationDetailRouteName]: ReservationDetailRouteParams
  [ProductReportRouteName]: ProductReportRouteParams
  [OrderReportRouteName]: OrderReportRouteParams
}

export type PdpScreenProps<RouteName extends keyof PdpParamList> = CompositeScreenProps<
  StackScreenProps<PdpParamList, RouteName>,
  StackScreenProps<RootStackParams>
>
