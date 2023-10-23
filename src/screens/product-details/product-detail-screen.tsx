import { useFocusEffect } from '@react-navigation/native'
import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { Divider } from '../../components/divider/divider'
import { HtmlText } from '../../components/html-text/html-text'
import { ModalScreen } from '../../components/modal-screen/modal-screen'
import { TextWithIcon } from '../../components/text-with-icon/text-with-icon'
import { TryAgainButton } from '../../components/try-again-button/try-again-button'
import { OfferDetails } from '../../features/product-detail/components/offer-details'
import { ProductDetailAllOffersButton } from '../../features/product-detail/components/product-detail-all-offers-button'
import { ProductDetailFooter } from '../../features/product-detail/components/product-detail-footer'
import { ProductDetailHeader } from '../../features/product-detail/components/product-detail-header'
import { ProductDetailOffer } from '../../features/product-detail/components/product-detail-section/product-detail-offer'
import { ShopAccessibilityInfo } from '../../features/product-detail/components/product-detail-section/shop-accessibility-info'
import { ShopDescription } from '../../features/product-detail/components/product-detail-section/shop-description'
import { ProductDetailTitle } from '../../features/product-detail/components/product-detail-title'
import { ProductDetailTyped } from '../../features/product-detail/components/product-detail-typed'
import { useProductDetailHeaderHeight } from '../../features/product-detail/hooks/use-product-detail-header-height'
import { ProductDetail } from '../../features/product-detail/types/product-detail'
import useAccessibilityFocus from '../../navigation/a11y/use-accessibility-focus'
import { Offer } from '../../services/api/types/commerce/api-types'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTheme } from '../../theme/hooks/use-theme'
import { spacing } from '../../theme/spacing'
import { textStyles } from '../../theme/typography'
import { useProductImageUrl } from '../../utils/image/hooks/use-product-image-url'

export type ProductDetailScreenProps = {
  productDetail: ProductDetail
  selectedOffer?: Offer
  randomMode: boolean
  onClose: () => void
  onOfferSelection: () => void
  onRandomReroll: () => void
  reserveProduct: () => void
  onPressReportButton: () => void
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  productDetail,
  selectedOffer,
  onClose,
  onOfferSelection,
  onRandomReroll,
  reserveProduct,
  randomMode,
  onPressReportButton,
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

  return (
    <ModalScreen whiteBottom testID={testID}>
      <View style={[styles.scrollContainer, { paddingTop: productDetailHeaderHeightProps.headerMinHeight }]}>
        <ProductDetailHeader
          {...productDetailHeaderHeightProps}
          scrollY={scrollY}
          onClose={onClose}
          imageUrl={productImage?.imageUrl}
          productDetail={productDetail}
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
              {selectedOffer ? <ProductDetailOffer showDistance offerInfo={selectedOffer} /> : null}
              {productDetail.offers !== undefined && productDetail.offers.length > 1 ? (
                <ProductDetailAllOffersButton
                  fulfillmentOption={productDetail.fulfillmentOption}
                  onPress={onOfferSelection}
                  offers={productDetail.offers}
                />
              ) : null}
              <ProductDetailTyped productDetail={productDetail} detailType="ProductDetail" />
              <View style={styles.description}>
                <HtmlText
                  testID={addTestIdModifier(testID, 'description')}
                  style={[textStyles.BodyRegular, { color: colors.labelColor }]}
                  html={productDetail.description}
                />
              </View>
              <View style={styles.report}>
                <TextWithIcon iconType="report" i18nKey="productDetail_report_button" onPress={onPressReportButton} />
              </View>
              {selectedOffer?.priceAdditionalInfo || selectedOffer?.description ? (
                <View style={styles.offerDetailsSection}>
                  <Divider marginBottom={0} marginTop={0} />
                  <View style={styles.offerDetailsSectionVerticalSpacing}>
                    <OfferDetails
                      testID={addTestIdModifier(testID, 'accessibility')}
                      description={selectedOffer.description}
                      priceAdditionalInfo={selectedOffer.priceAdditionalInfo}
                    />
                  </View>
                </View>
              ) : null}
              {selectedOffer?.shopDescription ? (
                <View style={styles.offerDetailsSection}>
                  <Divider marginBottom={0} marginTop={0} />
                  <View style={styles.offerDetailsSectionVerticalSpacing}>
                    <ShopDescription
                      testID={addTestIdModifier(testID, 'shop_description')}
                      shopDescription={selectedOffer.shopDescription}
                    />
                  </View>
                </View>
              ) : null}
              {selectedOffer ? (
                <>
                  <Divider marginBottom={0} marginTop={0} />
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
        <ProductDetailFooter
          fulfillmentOption={productDetail.fulfillmentOption}
          reservationSuspended={productDetail.reservationSuspended}
          selectedOffer={selectedOffer}
          onReserve={reserveProduct}
        />
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
    flexGrow: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    flex: 1,
  },
  scrollView: {
    paddingTop: spacing[7],
    paddingHorizontal: spacing[5],
    alignItems: 'flex-start',
  },
  description: {
    paddingTop: spacing[7],
  },
  report: {
    flex: 1,
    width: '100%',
    marginVertical: spacing[6],
    alignItems: 'center',
  },
  offerDetailsSection: {
    flexDirection: 'column',
    width: '100%',
  },
  offerDetailsSectionVerticalSpacing: {
    paddingVertical: spacing[7],
  },
})
