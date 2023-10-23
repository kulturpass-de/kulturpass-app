import React, { forwardRef } from 'react'
import { StyleSheet, Text } from 'react-native'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { colors } from '../../../theme/colors'
import { spacing } from '../../../theme/spacing'
import { textStyles } from '../../../theme/typography'
import { ProductDetail, ProductTypes } from '../types/product-detail'

type ProductDetailTitleProps = {
  productDetail: ProductDetail
}

const getProductSubtitle = (productDetail: ProductDetail): string | undefined => {
  switch (productDetail.productType) {
    case ProductTypes.Audio:
      return productDetail.artist
    case ProductTypes.Book:
      return productDetail.author
    case ProductTypes.SheetMusic:
      return productDetail.composer
    default:
      return undefined
  }
}

export const ProductDetailTitle = forwardRef<Text, ProductDetailTitleProps>(({ productDetail }, ref) => {
  const { buildTestId } = useTestIdBuilder()
  const { t } = useTranslation()
  const categoryName: string | undefined = productDetail.categories[0]?.name
  const productSubTitle = getProductSubtitle(productDetail)
  return (
    <>
      {categoryName ? (
        <Text
          accessibilityHint={t('productDetail_title_a11y_category_hint')}
          testID={buildTestId('productDetail_title')}
          style={[textStyles.MicroMediumCaps, { color: colors.moonDarkest }]}>
          {categoryName}
        </Text>
      ) : null}
      <Text
        testID={buildTestId('productDetail_name')}
        style={[textStyles.HeadlineH2Black, styles.title]}
        accessibilityHint={t('productDetail_title_a11y_title_hint')}
        accessibilityLabel={productDetail.name}
        accessible
        accessibilityRole="header"
        ref={ref}>
        {productDetail.name}
      </Text>
      {productSubTitle ? (
        <Text
          testID={buildTestId('productDetail_subtitle')}
          accessibilityHint={t('productDetail_title_a11y_subtitle_hint')}
          style={[textStyles.BodyRegular, styles.subtitle]}>
          {productSubTitle}
        </Text>
      ) : null}
    </>
  )
})

const styles = StyleSheet.create({
  title: {
    paddingVertical: spacing[2],
    color: colors.moonDarkest,
  },
  subtitle: {
    color: colors.moonDarkest,
  },
})
