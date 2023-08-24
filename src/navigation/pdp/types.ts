import { CompositeScreenProps } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import {
  OfferSelectionFilterRouteName,
  OfferSelectionFilterRouteParams,
} from '../../features/product-detail/screens/offer-selection-filter-route'
import {
  OfferSelectionRouteName,
  OfferSelectionRouteParams,
} from '../../features/product-detail/screens/offer-selection-route'
import {
  ProductConfirmReservationRouteName,
  ProductConfirmReservationRouteParams,
} from '../../features/product-detail/screens/product-confirm-reservation-route'
import {
  ProductDetailRouteName,
  ProductDetailRouteParams,
} from '../../features/product-detail/screens/product-detail-route'
import {
  ProductReportRouteName,
  ProductReportRouteParams,
} from '../../features/product-detail/screens/product-report-route'
import { OrderReportRouteName, OrderReportRouteParams } from '../../features/reservations/screens/order-report-route'
import {
  ReservationDetailRouteName,
  ReservationDetailRouteParams,
} from '../../features/reservations/screens/reservation-detail-route'
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
