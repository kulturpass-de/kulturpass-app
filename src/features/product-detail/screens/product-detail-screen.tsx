import React, { useCallback, useRef } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'

import { ModalScreen } from '../../../components/modal-screen/modal-screen'
import { ProductDetail } from '../types/product-detail'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { spacing } from '../../../theme/spacing'
import { textStyles } from '../../../theme/typography'
import { ProductDetailOffer } from '../components/product-detail-offer'
import { ProductDetailFooter } from '../components/product-detail-footer'
import {
  ProductDetailHeader,
  PRODUCT_DETAIL_HEADER_HEIGHT_DIFF,
  PRODUCT_DETAIL_HEADER_MIN_HEIGHT,
} from '../components/product-detail-header'
import { ProductDetailTitle } from '../components/product-detail-title'
import { ProductDetailAllOffersButton } from '../components/product-detail-all-offers-button'
import { Offer } from '../../../services/api/types/commerce/api-types'
import { useThumbnailImageUrl } from '../../../utils/image/hooks/use-thumbnail-image-url'
import { ProductDetailTyped } from '../components/product-detail-typed'
import { colors } from '../../../theme/colors'

export type ProductDetailScreenProps = {
  productDetail: ProductDetail
  selectedOffer?: Offer
  onClose: () => void
  onOfferSelection: () => void
  reserveProduct: () => void
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  productDetail,
  selectedOffer,
  onClose,
  onOfferSelection,
  reserveProduct,
}) => {
  const { buildTestId } = useTestIdBuilder()
  const scrollY = useRef(new Animated.Value(0)).current

  const onFavorite = useCallback(() => {
    console.log('Favorited!')
  }, [])

  const thumbnailImage = useThumbnailImageUrl(productDetail.images)

  return (
    <ModalScreen whiteBottom testID={buildTestId('productDetail')}>
      <View style={styles.scrollContainer}>
        <ProductDetailHeader scrollY={scrollY} onClose={onClose} imageUrl={thumbnailImage?.imageUrl} />
        <Animated.ScrollView
          testID={buildTestId('productDetail_content')}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
            useNativeDriver: true,
          })}
          contentContainerStyle={styles.scrollView}>
          <ProductDetailTitle productDetail={productDetail} />
          {selectedOffer ? (
            <ProductDetailOffer copyAddressToClipboard showDistance selectedOffer={selectedOffer} />
          ) : null}
          {productDetail.offers !== undefined && productDetail.offers.length > 1 ? (
            <ProductDetailAllOffersButton onPress={onOfferSelection} offers={productDetail.offers} />
          ) : null}
          <ProductDetailTyped productDetail={productDetail} />
          <Text testID={buildTestId('productDetail_description')} style={[textStyles.BodyRegular, styles.description]}>
            {productDetail.description}
          </Text>
        </Animated.ScrollView>
        <ProductDetailFooter selectedOffer={selectedOffer} onFavorite={onFavorite} onReserve={reserveProduct} />
      </View>
    </ModalScreen>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingTop: PRODUCT_DETAIL_HEADER_MIN_HEIGHT,
    height: '100%',
  },
  scrollView: {
    marginTop: PRODUCT_DETAIL_HEADER_HEIGHT_DIFF,
    paddingTop: spacing[7],
    paddingBottom: PRODUCT_DETAIL_HEADER_HEIGHT_DIFF + spacing[7],
    paddingHorizontal: spacing[5],
    alignItems: 'flex-start',
  },
  description: {
    paddingTop: spacing[7],
    color: colors.moonDarkest,
  },
})
