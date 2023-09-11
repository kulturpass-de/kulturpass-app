import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback } from 'react'
import { LoadingIndicator } from '../../../components/loading-indicator/loading-indicator'
import { PdpParamList, PdpScreenProps } from '../../../navigation/pdp/types'
import { RootStackParams } from '../../../navigation/types'
import { createRouteConfig } from '../../../navigation/utils/create-route-config'
import { commerceApi } from '../../../services/api/commerce-api'
import { Order } from '../../../services/api/types/commerce/api-types'
import { modalCardStyle } from '../../../theme/utils'
import { useQueryProductDetail } from '../../product-detail/hooks/use-query-product-detail'
import { OrderReportRouteName } from './order-report-route'
import { ReservationDetailScreen } from './reservation-detail-screen'

export const ReservationDetailRouteName = 'ReservationDetail'

export type ReservationDetailRouteParams = {
  orderCode: NonNullable<Order['code']>
  completedReservation?: boolean
}

type ReservationDetailProps = PdpScreenProps<'ReservationDetail'>

export const ReservationDetailRoute: React.FC<ReservationDetailProps> = ({ route }) => {
  const rootNavigation = useNavigation<StackNavigationProp<RootStackParams>>()
  const navigation = useNavigation<StackNavigationProp<PdpParamList>>()

  const { orderCode, completedReservation } = route.params
  const orderDetailResponse = commerceApi.useGetOrderDetailQuery({ orderCode }, { refetchOnMountOrArgChange: true })
  const order = orderDetailResponse.data
  const orderEntry = order?.entries?.[0]

  const { data: productDetail, isLoading } = useQueryProductDetail(orderEntry?.product?.code)

  const onClose = useCallback(() => {
    rootNavigation.navigate('Tabs')
  }, [rootNavigation])

  const onPressReportButton = useCallback(() => {
    navigation.navigate(OrderReportRouteName, {
      offerId: orderEntry?.offerId,
      shopName: orderEntry?.shopName,
      shopId: orderEntry?.shopId,
      orderId: order?.code,
    })
  }, [navigation, order?.code, orderEntry?.offerId, orderEntry?.shopId, orderEntry?.shopName])

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
        onPressReportButton={onPressReportButton}
        afterCancelReservationTriggered={onClose}
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
