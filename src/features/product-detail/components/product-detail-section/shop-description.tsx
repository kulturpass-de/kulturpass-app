import React from 'react'
import { StyleSheet } from 'react-native'
import { HtmlText } from '../../../../components/html-text/html-text'
import { Offer } from '../../../../services/api/types/commerce/api-types'
import { useTestIdBuilder } from '../../../../services/test-id/test-id'
import { useTheme } from '../../../../theme/hooks/use-theme'
import { spacing } from '../../../../theme/spacing'
import { textStyles } from '../../../../theme/typography'
import { ProductDetailSection } from './product-detail-section'

export type ShopDescriptionProps = Pick<Offer, 'shopDescription'> & {
  testID: string
}

export const ShopDescription: React.FC<ShopDescriptionProps> = ({ shopDescription, testID }) => {
  const { addTestIdModifier } = useTestIdBuilder()
  const { colors } = useTheme()

  if (!shopDescription) {
    return null
  }

  return (
    <ProductDetailSection
      iconSource="shop"
      style={styles.productDetailContainer}
      testID={addTestIdModifier(testID, 'section')}
      sectionCaptioni18nKey="productDetail_shop_description">
      <HtmlText
        style={[textStyles.BodyRegular, styles.container, { color: colors.labelColor }]}
        testID={addTestIdModifier(testID, 'text')}
        html={shopDescription}
      />
    </ProductDetailSection>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing[2],
  },
  productDetailContainer: {
    paddingTop: 0,
  },
})
