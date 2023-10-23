import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Icon } from '../../../components/icon/icon'
import { SvgImage } from '../../../components/svg-image/svg-image'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { Category, Price } from '../../../services/api/types/commerce/api-types'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { colors } from '../../../theme/colors'
import { spacing } from '../../../theme/spacing'
import { textStyles } from '../../../theme/typography'
import { useFormattedPrice } from '../../../utils/price/hooks/use-formatted-price'
import { ProductDetail, ProductTypes } from '../types/product-detail'
import { isProductVoucherPickup, svgForProductType, svgForVoucherCategory } from '../utils'

export type ProductConfirmOverviewProps = {
  productDetail: ProductDetail
  price: Price | undefined
}

const PRODUCT_TYPE_ICON_SIZE = {
  width: 84,
  height: 68,
}

export const ProductConfirmOverview: React.FC<ProductConfirmOverviewProps> = ({ productDetail, price }) => {
  const { buildTestId } = useTestIdBuilder()
  const { t } = useTranslation()
  const formattedPrice = useFormattedPrice(price)

  const category: Category | undefined = productDetail.categories[0]
  const isVoucherPickup = isProductVoucherPickup(productDetail)
  const svgImageType =
    productDetail.productType === ProductTypes.Voucher && category.code
      ? svgForVoucherCategory[category.code]
      : svgForProductType[productDetail.productType]

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.textContainer}>
          {category?.name ? (
            <Text
              style={[textStyles.MicroMediumCaps, styles.categoryText]}
              accessibilityLabel={t('productDetail_confirmReservation_productCategory')}
              testID={buildTestId('productDetail_confirmReservation_productCategory')}>
              {category.name}
            </Text>
          ) : null}
          <Text
            style={[textStyles.BodyRegular, { color: colors.moonDarkest }]}
            accessibilityLabel={t('productDetail_confirmReservation_productName')}
            numberOfLines={2}
            testID={buildTestId('productDetail_confirmReservation_productName')}>
            {productDetail.name}
          </Text>
        </View>
        {svgImageType !== undefined ? (
          <SvgImage
            type={svgImageType}
            width={PRODUCT_TYPE_ICON_SIZE.width}
            height={PRODUCT_TYPE_ICON_SIZE.height}
            testID={buildTestId('productDetail_confirmReservation_overview')}
          />
        ) : null}
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.productPriceInfoContainer}>
          {!isVoucherPickup && productDetail.productType === ProductTypes.Voucher ? (
            <>
              <Icon source="Info" width={16} height={16} />
              <TranslatedText
                i18nKey="productDetail_confirmReservation_productPriceInfo"
                textStyle="CaptionExtrabold"
                textStyleOverrides={styles.productPriceInfo}
                testID={buildTestId('productDetail_confirmReservation_productPriceInfo')}
              />
            </>
          ) : null}
        </View>
        <Text
          style={[textStyles.HeadlineH3Extrabold, styles.productPrice]}
          accessibilityLabel={t('productDetail_confirmReservation_productPrice')}
          testID={buildTestId('productDetail_confirmReservation_productPrice')}>
          {formattedPrice}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.basicWhite,
    borderRadius: 16,
    flexDirection: 'column',
    paddingLeft: spacing[5],
    paddingBottom: spacing[4],
    overflow: 'hidden',
  },
  topContainer: {
    flexDirection: 'row',
  },
  textContainer: {
    flexDirection: 'column',
    paddingTop: spacing[5],
    paddingRight: spacing[5],
    paddingBottom: spacing[1],
    flex: 1,
  },
  categoryText: {
    paddingBottom: spacing[2],
    color: colors.moonDarkest,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPriceInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  productPriceInfo: {
    paddingLeft: spacing[2],
  },
  productPrice: {
    color: colors.moonDarkest,
    paddingHorizontal: spacing[5],
  },
})
