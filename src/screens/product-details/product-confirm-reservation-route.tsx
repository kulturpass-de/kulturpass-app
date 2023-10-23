import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback } from 'react'
import { InteractionManager } from 'react-native'
import { useDispatch } from 'react-redux'
import { showInAppReview } from '../../features/in-app-review/redux/thunks/show-in-app-review'
import { ProductDetail } from '../../features/product-detail/types/product-detail'
import { PdpParamList, PdpScreenProps } from '../../navigation/pdp/types'
import { RootStackParams } from '../../navigation/types'
import { createRouteConfig } from '../../navigation/utils/create-route-config'
import { Offer } from '../../services/api/types/commerce/api-types'
import { AppDispatch } from '../../services/redux/configure-store'
import { modalCardStyle } from '../../theme/utils'
import { ReservationDetailRouteParams } from '../reservations/reservation-detail-route'
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
  const dispatch = useDispatch<AppDispatch>()
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
      // Show Review Popup after Animation. Otherwise the Screen is frozen mid Animation on Android.
      InteractionManager.runAfterInteractions().then(() => {
        dispatch(showInAppReview())
      })
    },
    [dispatch, navigation],
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
