import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback } from 'react'
import { LoadingIndicator } from '../../../components/loading-indicator/loading-indicator'
import { PdpParamList, PdpScreenProps } from '../../../navigation/pdp/types'
import { RootStackParams } from '../../../navigation/types'
import { createRouteConfig } from '../../../navigation/utils/createRouteConfig'
import { Offer, Product } from '../../../services/api/types/commerce/api-types'
import { useDismissableError } from '../../../services/errors/use-dismissable-error'
import { modalCardStyle } from '../../../theme/utils'
import { ErrorAlert } from '../../form-validation/components/error-alert'
import { ReservationDetailRouteParams } from '../../reservations/screens/reservation-detail-route'
import { useQueryProductDetail } from '../hooks/use-query-product-detail'
import { useSelectedOrClosestOffer } from '../hooks/use-selected-or-closest-offer'
import { ProductConfirmReservationScreen } from './product-confirm-reservation-screen'

export const ProductConfirmReservationRouteName = 'ProductConfirmReservation'

export type ProductConfirmReservationRouteParams = {
  productCode: NonNullable<Product['code']>
  offerId: Offer['id']
}

type ProfileScreenProps = PdpScreenProps<'ProductConfirmReservation'>

export const ProductConfirmReservationRoute: React.FC<ProfileScreenProps> = ({ route }) => {
  const rootNavigation = useNavigation<StackNavigationProp<RootStackParams>>()
  const navigation = useNavigation<StackNavigationProp<PdpParamList>>()
  const { productCode, offerId } = route.params

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

  const { data: productDetail, error, isLoading } = useQueryProductDetail(productCode)
  const selectedOffer = useSelectedOrClosestOffer(productDetail, offerId)

  const { visibleError, onDismissVisibleError } = useDismissableError(!isLoading ? error : undefined)

  if (!productDetail || !selectedOffer) {
    return <ErrorAlert error={visibleError} onDismiss={onDismissVisibleError} />
  }

  return (
    <>
      <LoadingIndicator loading={isLoading} />
      <ProductConfirmReservationScreen
        onBack={onBack}
        onClose={onClose}
        afterReserveProduct={afterReserveProduct}
        productDetail={productDetail}
        selectedOffer={selectedOffer}
      />
    </>
  )
}

export const ProductConfirmReservationRouteConfig = createRouteConfig({
  name: ProductConfirmReservationRouteName,
  component: ProductConfirmReservationRoute,
  options: { cardStyle: modalCardStyle },
})
