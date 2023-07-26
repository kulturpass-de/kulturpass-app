import { useFocusEffect } from '@react-navigation/core'
import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { Divider } from '../../../components/divider/divider'
import { HtmlText } from '../../../components/html-text/html-text'
import { ModalScreen } from '../../../components/modal-screen/modal-screen'
import { TryAgainButton } from '../../../components/try-again-button/try-again-button'
import useAccessibilityFocus from '../../../navigation/a11y/use-accessibility-focus'
import { Offer } from '../../../services/api/types/commerce/api-types'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import { textStyles } from '../../../theme/typography'
import { useProductImageUrl } from '../../../utils/image/hooks/use-product-image-url'
import { ProductDetailAllOffersButton } from '../components/product-detail-all-offers-button'
import { ProductDetailFooter } from '../components/product-detail-footer'
import { ProductDetailHeader } from '../components/product-detail-header'
import { ProductDetailOffer } from '../components/product-detail-offer'
import { ProductDetailTitle } from '../components/product-detail-title'
import { ProductDetailTyped } from '../components/product-detail-typed'
import { ShopAccessibilityInfo } from '../components/shop-accessibility-info'
import { useProductDetailHeaderHeight } from '../hooks/use-product-detail-header-height'
import { ProductDetail } from '../types/product-detail'
import { useDismissSwipingDown } from './use-dismiss-swiping-down'

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
  const { colors } = useTheme()
  const scrollY = useRef(new Animated.Value(0)).current

  const productImage = useProductImageUrl(productDetail.images, 'zoom')
  const testID = buildTestId('productDetail')

  const [focusRef, setFocus] = useAccessibilityFocus('both', 1500)

  const productDetailHeaderHeightProps = useProductDetailHeaderHeight()

  useFocusEffect(setFocus)
  useEffect(setFocus, [setFocus, productDetail])

  const swipingDown = useDismissSwipingDown({
    scrollY,
    productDetailHeaderHeightProps,
  })

  return (
    <ModalScreen whiteBottom testID={testID}>
      <View style={[styles.scrollContainer, swipingDown.containerStyle]}>
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
                swipingDown.isEnabled && styles.scrollViewGestureEnabled,
                !swipingDown.isEnabled && {
                  marginTop: productDetailHeaderHeightProps.headerHeightDiff,
                },
                {
                  paddingBottom: productDetailHeaderHeightProps.headerHeightDiff + spacing[7],
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
                  style={[textStyles.BodyRegular, { color: colors.labelColor }]}
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
  scrollViewGestureEnabled: {
    marginTop: 0,
  },
  description: {
    paddingTop: spacing[7],
  },
})
