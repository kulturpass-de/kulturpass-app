import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet, View } from 'react-native'

import { ModalScreen } from '../../../components/modal-screen/modal-screen'
import { ProductDetail } from '../types/product-detail'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { spacing } from '../../../theme/spacing'
import { textStyles } from '../../../theme/typography'
import { ProductDetailOffer } from '../components/product-detail-offer'
import { ProductDetailFooter } from '../components/product-detail-footer'
import { ProductDetailHeader } from '../components/product-detail-header'
import { ProductDetailTitle } from '../components/product-detail-title'
import { ProductDetailAllOffersButton } from '../components/product-detail-all-offers-button'
import { Offer } from '../../../services/api/types/commerce/api-types'
import { useProductImageUrl } from '../../../utils/image/hooks/use-product-image-url'
import { ProductDetailTyped } from '../components/product-detail-typed'
import { colors } from '../../../theme/colors'
import { ShopAccessibilityInfo } from '../components/shop-accessibility-info'
import { Divider } from '../../../components/divider/divider'
import { TryAgainButton } from '../../../components/try-again-button/try-again-button'
import { HtmlText } from '../../../components/html-text/html-text'
import useAccessibilityFocus from '../../../navigation/a11y/use-accessibility-focus'
import { useFocusEffect } from '@react-navigation/native'
import { useProductDetailHeaderHeight } from '../hooks/use-product-detail-header-height'

export type ProductDetailScreenProps = {
  productDetail: ProductDetail
  selectedOffer?: Offer
  randomMode: boolean
  onClose: () => void
  onOfferSelection: () => void
  onRandomReroll: () => void
  reserveProduct: () => void
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  productDetail,
  selectedOffer,
  onClose,
  onOfferSelection,
  onRandomReroll,
  reserveProduct,
  randomMode,
}) => {
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const scrollY = useRef(new Animated.Value(0)).current

  const productImage = useProductImageUrl(productDetail.images, 'zoom')
  const testID = buildTestId('productDetail')

  const [focusRef, setFocus] = useAccessibilityFocus('both', 1500)

  const productDetailHeaderHeightProps = useProductDetailHeaderHeight()

  useFocusEffect(setFocus)
  useEffect(setFocus, [setFocus, productDetail])

  return (
    <ModalScreen whiteBottom testID={testID}>
      <View style={[styles.scrollContainer, { paddingTop: productDetailHeaderHeightProps.headerMinHeight }]}>
        <ProductDetailHeader
          {...productDetailHeaderHeightProps}
          scrollY={scrollY}
          onClose={onClose}
          imageUrl={productImage?.imageUrl}
        />
        <View style={styles.contentContainer}>
          {productDetailHeaderHeightProps.headerHeightDiff === null ? null : (
            <Animated.ScrollView
              testID={addTestIdModifier(testID, 'content')}
              onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
                useNativeDriver: true,
              })}
              contentContainerStyle={[
                styles.scrollView,
                {
                  paddingBottom: productDetailHeaderHeightProps.headerHeightDiff + spacing[7],
                  marginTop: productDetailHeaderHeightProps.headerHeightDiff,
                },
              ]}>
              <ProductDetailTitle productDetail={productDetail} ref={focusRef} />
              {selectedOffer ? (
                <ProductDetailOffer copyAddressToClipboard showDistance offerInfo={selectedOffer} />
              ) : null}
              {productDetail.offers !== undefined && productDetail.offers.length > 1 ? (
                <ProductDetailAllOffersButton onPress={onOfferSelection} offers={productDetail.offers} />
              ) : null}
              <ProductDetailTyped productDetail={productDetail} />
              <View style={styles.description}>
                <HtmlText
                  testID={addTestIdModifier(testID, 'description')}
                  style={styles.descriptionHtmlText}
                  html={productDetail.description}
                />
              </View>
              {selectedOffer ? (
                <>
                  <Divider marginBottom={0} />
                  <ShopAccessibilityInfo
                    testID={addTestIdModifier(testID, 'accessibility')}
                    selectedOffer={selectedOffer}
                  />
                </>
              ) : null}
              {randomMode ? <View style={styles.tryAgainPlaceholder} /> : null}
            </Animated.ScrollView>
          )}
          {randomMode ? (
            <View style={styles.tryAgainButton}>
              <TryAgainButton
                i18nKey="productDetail_random_tryAgain_button"
                testID={buildTestId('productDetail_random_tryAgain_button')}
                widthOption="content"
                randomTrigger={productDetail.code}
                onPress={onRandomReroll}
              />
            </View>
          ) : null}
        </View>
        <ProductDetailFooter selectedOffer={selectedOffer} onReserve={reserveProduct} />
      </View>
    </ModalScreen>
  )
}

const styles = StyleSheet.create({
  tryAgainButton: {
    position: 'absolute',
    bottom: spacing[5],
    left: 0,
    right: 0,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  tryAgainPlaceholder: {
    paddingBottom: spacing[5],
    paddingTop: spacing[6],
    height: 48,
  },
  contentContainer: {
    flex: 1,
  },
  scrollContainer: {
    height: '100%',
  },
  scrollView: {
    paddingTop: spacing[7],
    paddingHorizontal: spacing[5],
    alignItems: 'flex-start',
  },
  description: {
    paddingTop: spacing[7],
  },
  descriptionHtmlText: {
    ...textStyles.BodyRegular,
    color: colors.moonDarkest,
  },
})
