import React from 'react'
import { ProductDetail } from '../types/product-detail'
import { StyleSheet, View, Text } from 'react-native'
import { colors } from '../../../theme/colors'
import { SvgImage } from '../../../components/svg-image/svg-image'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { textStyles } from '../../../theme/typography'
import { useTranslation } from '../../../services/translation/translation'
import { Category, Price } from '../../../services/api/types/commerce/api-types'
import { useFormattedPrice } from '../../../utils/price/hooks/use-formatted-price'
import { spacing } from '../../../theme/spacing'
import { svgForCategory } from '../utils'

export type ProductConfirmOverviewProps = {
  productDetail: ProductDetail
  price: Price | undefined
}

export const ProductConfirmOverview: React.FC<ProductConfirmOverviewProps> = ({ productDetail, price }) => {
  const { buildTestId } = useTestIdBuilder()
  const { t } = useTranslation()
  const formattedPrice = useFormattedPrice(price)

  const category: Category | undefined = productDetail.categories[0]
  const svgImageType = category.code !== undefined ? svgForCategory[category.code] : undefined

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
            {productDetail.description}
          </Text>
        </View>
        {svgImageType !== undefined ? (
          <SvgImage
            type={svgImageType}
            screenWidthRelativeSize={0.17}
            testID={buildTestId('productDetail_confirmReservation_overview')}
          />
        ) : null}
      </View>
      <Text
        style={[textStyles.HeadlineH3Extrabold, styles.productPrice]}
        accessibilityLabel={t('productDetail_confirmReservation_productPrice')}
        testID={buildTestId('productDetail_confirmReservation_productPrice')}>
        {formattedPrice}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.basicWhite,
    borderRadius: 16,
    flexDirection: 'column',
    alignItems: 'stretch',
    overflow: 'hidden',
    paddingLeft: spacing[5],
    paddingBottom: spacing[5],
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryText: {
    paddingBottom: spacing[2],
    color: colors.moonDarkest,
  },
  textContainer: {
    flexDirection: 'column',
    paddingTop: spacing[5],
    flexShrink: 1,
  },
  productPrice: {
    textAlign: 'right',
    color: colors.moonDarkest,
    paddingRight: spacing[5],
  },
})
