import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { LoadingIndicator } from '../../../components/loading-indicator/loading-indicator'
import { PdpParamList, PdpScreenProps } from '../../../navigation/pdp/types'
import { RootStackParams } from '../../../navigation/types'
import { createRouteConfig } from '../../../navigation/utils/create-route-config'
import { commerceApi } from '../../../services/api/commerce-api'
import { GetProductDetailParams } from '../../../services/api/types'
import { Offer } from '../../../services/api/types/commerce/api-types'
import { useDismissableError } from '../../../services/errors/use-dismissable-error'
import { selectDefaultLocationProvider } from '../../../services/user/redux/user-selectors'
import { modalCardStyle } from '../../../theme/utils'
import { ErrorAlert } from '../../form-validation/components/error-alert'
import { useQueryProductDetail } from '../hooks/use-query-product-detail'
import { useSelectedOrClosestOffer } from '../hooks/use-selected-or-closest-offer'
import { ProductDetailScreen } from './product-detail-screen'
import { ProductReportRouteName } from './product-report-route'

export const ProductDetailRouteName = 'ProductDetail'

export type ProductDetailRouteParams = {
  productCode: string
  randomMode: boolean
  offerId?: Offer['id']
  offersByLocation?: GetProductDetailParams['location']
}

type ProfileScreenProps = PdpScreenProps<'ProductDetail'>

export const ProductDetailRoute: React.FC<ProfileScreenProps> = ({ route }) => {
  const rootNavigation = useNavigation<StackNavigationProp<RootStackParams>>()
  const navigation = useNavigation<StackNavigationProp<PdpParamList>>()
  const { productCode, offerId, randomMode, offersByLocation } = route.params

  const [randomProductQueryTrigger, randomProductResult] = commerceApi.useLazyGetRandomProductQuery()

  const onClose = useCallback(() => {
    rootNavigation.navigate('Tabs')
  }, [rootNavigation])

  const onRandomReroll = useCallback(async () => {
    const randomProduct = await randomProductQueryTrigger({}).unwrap()
    navigation.setParams({
      productCode: randomProduct.code,
      randomMode: true,
    })
  }, [navigation, randomProductQueryTrigger])

  const defaultLocationProvider = useSelector(selectDefaultLocationProvider)
  const { data: productDetail, error, isFetching } = useQueryProductDetail(productCode, offersByLocation)

  const onOfferSelection = useCallback(() => {
    const location = offersByLocation ?? defaultLocationProvider

    navigation.navigate('OfferSelection', { productCode, offersByLocation: location, randomMode })
  }, [navigation, productCode, randomMode, offersByLocation, defaultLocationProvider])

  const selectedOffer = useSelectedOrClosestOffer(productDetail, offerId)

  const onPressReportButton = useCallback(() => {
    navigation.navigate(ProductReportRouteName, {
      offerId: selectedOffer?.code,
      shopName: selectedOffer?.shopName,
      shopId: selectedOffer?.shopId,
    })
  }, [navigation, selectedOffer])

  const reserveProduct = useCallback(async () => {
    if (!selectedOffer || !productDetail) {
      return
    }

    navigation.navigate('ProductConfirmReservation', { productDetail, selectedOffer })
  }, [productDetail, selectedOffer, navigation])

  const { visibleError, onDismissVisibleError } = useDismissableError(
    !isFetching ? error ?? randomProductResult.error : undefined,
  )

  const handleDismissErrorAndClose = useCallback(() => {
    onDismissVisibleError()
    onClose()
  }, [onClose, onDismissVisibleError])

  return (
    <>
      <LoadingIndicator loading={isFetching || randomProductResult.isFetching} />
      <ErrorAlert error={visibleError} onDismiss={handleDismissErrorAndClose} />
      {productDetail && productDetail.code === productCode ? (
        <ProductDetailScreen
          onClose={onClose}
          onOfferSelection={onOfferSelection}
          onRandomReroll={onRandomReroll}
          productDetail={productDetail}
          selectedOffer={selectedOffer}
          randomMode={randomMode}
          reserveProduct={reserveProduct}
          onPressReportButton={onPressReportButton}
        />
      ) : null}
    </>
  )
}

export const ProductDetailRouteConfig = createRouteConfig({
  name: ProductDetailRouteName,
  component: ProductDetailRoute,
  options: { cardStyle: modalCardStyle },
})
