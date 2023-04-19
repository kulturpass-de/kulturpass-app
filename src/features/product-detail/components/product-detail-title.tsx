import React from 'react'
import { StyleSheet, Text } from 'react-native'

import { ProductDetail, ProductTypes } from '../types/product-detail'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { spacing } from '../../../theme/spacing'
import { textStyles } from '../../../theme/typography'
import { colors } from '../../../theme/colors'

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

export const ProductDetailTitle: React.FC<ProductDetailTitleProps> = ({ productDetail }) => {
  const { buildTestId } = useTestIdBuilder()
  const categoryName: string | undefined = productDetail.categories[0]?.name
  const productSubTitle = getProductSubtitle(productDetail)
  return (
    <>
      {categoryName ? (
        <Text
          testID={buildTestId('productDetail_title')}
          style={[textStyles.MicroMediumCaps, { color: colors.moonDarkest }]}>
          {categoryName}
        </Text>
      ) : null}
      <Text testID={buildTestId('productDetail_name')} style={[textStyles.HeadlineH2Black, styles.title]}>
        {productDetail.name}
      </Text>
      {productSubTitle ? (
        <Text testID={buildTestId('productDetail_subtitle')} style={[textStyles.BodyRegular, styles.subtitle]}>
          {productSubTitle}
        </Text>
      ) : null}
    </>
  )
}

const styles = StyleSheet.create({
  title: {
    paddingVertical: spacing[2],
    color: colors.moonDarkest,
  },
  subtitle: {
    color: colors.moonDarkest,
  },
})
