import { useNetInfo } from '@react-native-community/netinfo'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback, useMemo } from 'react'
import { LoadingIndicator } from '../../components/loading-indicator/loading-indicator'
import { ErrorAlert } from '../../features/form-validation/components/error-alert'
import { useAndroidBackButtonHandler } from '../../features/preferences/hooks/use-android-back-button-handler'
import { useQueryProductDetail } from '../../features/product-detail/hooks/use-query-product-detail'
import { ProductDetail } from '../../features/product-detail/types/product-detail'
import { PdpParamList, PdpScreenProps } from '../../navigation/pdp/types'
import { RootStackParams } from '../../navigation/types'
import { createRouteConfig } from '../../navigation/utils/create-route-config'
import { commerceApi } from '../../services/api/commerce-api'
import { useOfflineOrderDetail } from '../../services/api/redux/hooks/use-offline-order-detail'
import { useOfflineProductDetail } from '../../services/api/redux/hooks/use-offline-product-detail'
import { Offer, Order, OrderEntry } from '../../services/api/types/commerce/api-types'
import { COMPLETED_STATUSES } from '../../services/api/types/commerce/commerce-get-reservations'
import { useDismissableError } from '../../services/errors/use-dismissable-error'
import { modalCardStyle } from '../../theme/utils'
import { OrderReportRouteName } from './order-report-route'
import { ReservationDetailScreen } from './reservation-detail-screen'

export const ReservationDetailRouteName = 'ReservationDetail'

export type ReservationDetailRouteParams = {
  orderCode: NonNullable<Order['code']>
}

type ReservationDetailProps = PdpScreenProps<'ReservationDetail'>

export const ReservationDetailRoute: React.FC<ReservationDetailProps> = ({ route }) => {
  const rootNavigation = useNavigation<StackNavigationProp<RootStackParams>>()
  const navigation = useNavigation<StackNavigationProp<PdpParamList>>()
  const netInfo = useNetInfo()

  const { orderCode } = route.params
  const orderDetailResponse = commerceApi.useGetOrderDetailQuery({ orderCode }, { refetchOnMountOrArgChange: true })
  const offlineOrderDetail = useOfflineOrderDetail(orderCode)

  const { order, orderEntry, completedReservation } = useMemo((): {
    order: Order | undefined
    orderEntry: OrderEntry | undefined
    completedReservation: boolean | undefined
  } => {
    const orderDetail = orderDetailResponse.data ?? offlineOrderDetail
    return {
      order: orderDetail,
      orderEntry: orderDetail?.entries?.[0],
      completedReservation: orderDetail?.status ? COMPLETED_STATUSES.includes(orderDetail.status) : undefined,
    }
  }, [offlineOrderDetail, orderDetailResponse.data])

  // NOTE: The productDetail is fetched because of the offer and its accessibility data.
  // The offer might randomly be undefined, as the offer list is not stable
  // and could change for each productDetail fetch.
  // A better approach would be getting the accessibility information out of the order. (currently not supported)
  const { data: productDetail, isLoading, error } = useQueryProductDetail(orderEntry?.product?.code)
  const offlineProductDetail = useOfflineProductDetail(orderEntry?.product?.code)
  const selectedOffer: Offer | undefined = useMemo(
    () =>
      orderEntry
        ? (productDetail ?? offlineProductDetail)?.offers?.find(offer => offer.id === orderEntry.offerId)
        : undefined,
    [offlineProductDetail, orderEntry, productDetail],
  )

  const dataMissing = useMemo(() => {
    return order === undefined || orderEntry === undefined || orderEntry.product === undefined
  }, [order, orderEntry])

  const onClose = useCallback(() => {
    rootNavigation.navigate('Tabs')
  }, [rootNavigation])

  const onAndroidBack = useCallback(() => {
    onClose()
    return true
  }, [onClose])

  useAndroidBackButtonHandler(onAndroidBack)

  const onPressReportButton = useCallback(() => {
    navigation.navigate(OrderReportRouteName, {
      offerId: orderEntry?.offerId,
      shopName: orderEntry?.shopName,
      shopId: orderEntry?.shopId,
      orderId: order?.code,
    })
  }, [navigation, order?.code, orderEntry?.offerId, orderEntry?.shopId, orderEntry?.shopName])

  const { visibleError, onDismissVisibleError } = useDismissableError(
    !isLoading && !orderDetailResponse.isLoading ? orderDetailResponse.error ?? error : undefined,
  )

  const handleDismissErrorAndClose = useCallback(() => {
    onDismissVisibleError()
    if (dataMissing) {
      onClose()
    }
  }, [dataMissing, onClose, onDismissVisibleError])

  return (
    <>
      <LoadingIndicator loading={isLoading || orderDetailResponse.isLoading} />
      <ErrorAlert
        error={netInfo.isConnected || dataMissing ? visibleError : undefined}
        onDismiss={handleDismissErrorAndClose}
      />
      {order && !dataMissing && orderEntry?.product ? (
        <ReservationDetailScreen
          productDetail={orderEntry.product as ProductDetail}
          selectedOffer={selectedOffer}
          order={order}
          onClose={onClose}
          onPressReportButton={onPressReportButton}
          afterCancelReservationTriggered={onClose}
          completedReservation={completedReservation}
        />
      ) : null}
    </>
  )
}

export const ReservationDetailRouteConfig = createRouteConfig({
  name: ReservationDetailRouteName,
  component: ReservationDetailRoute,
  options: { cardStyle: modalCardStyle },
})
