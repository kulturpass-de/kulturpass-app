import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback } from 'react'
import { PdpParamList, PdpScreenProps } from '../../../navigation/pdp/types'
import { RootStackParams } from '../../../navigation/types'
import { createRouteConfig } from '../../../navigation/utils/createRouteConfig'
import { Offer } from '../../../services/api/types/commerce/api-types'
import { modalCardStyle } from '../../../theme/utils'
import { ReservationDetailRouteParams } from '../../reservations/screens/reservation-detail-route'
import { ProductDetail } from '../types/product-detail'
import { ProductConfirmReservationScreen } from './product-confirm-reservation-screen'

export const ProductConfirmReservationRouteName = 'ProductConfirmReservation'

export type ProductConfirmReservationRouteParams = {
  productDetail: ProductDetail
  selectedOffer: Offer
}

type ProfileScreenProps = PdpScreenProps<'ProductConfirmReservation'>

export const ProductConfirmReservationRoute: React.FC<ProfileScreenProps> = ({ route }) => {
  const rootNavigation = useNavigation<StackNavigationProp<RootStackParams>>()
  const navigation = useNavigation<StackNavigationProp<PdpParamList>>()
  const { productDetail, selectedOffer } = route.params

  const onClose = useCallback(() => {
    rootNavigation.navigate('Tabs')
  }, [rootNavigation])

  const onBack = useCallback(() => {
    rootNavigation.goBack()
  }, [rootNavigation])

  const afterReserveProduct = useCallback(
    (params: ReservationDetailRouteParams) => {
      navigation.navigate('ReservationDetail', params)
    },
    [navigation],
  )

  return (
    <ProductConfirmReservationScreen
      onBack={onBack}
      onClose={onClose}
      afterReserveProduct={afterReserveProduct}
      productDetail={productDetail}
      selectedOffer={selectedOffer}
    />
  )
}

export const ProductConfirmReservationRouteConfig = createRouteConfig({
  name: ProductConfirmReservationRouteName,
  component: ProductConfirmReservationRoute,
  options: { cardStyle: modalCardStyle },
})
