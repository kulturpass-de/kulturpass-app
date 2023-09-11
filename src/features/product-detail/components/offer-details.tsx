import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Offer } from '../../../services/api/types/commerce/api-types'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import { textStyles } from '../../../theme/typography'
import { ProductDetailSection } from './product-detail-section'

export type OfferDetailsProps = {
  description: Offer['description']
  priceAdditionalInfo: Offer['priceAdditionalInfo']
  testID: string
}

export const OfferDetails: React.FC<OfferDetailsProps> = ({ description, priceAdditionalInfo, testID }) => {
  const { addTestIdModifier } = useTestIdBuilder()
  const { colors } = useTheme()

  if (!description && !priceAdditionalInfo) {
    return null
  }

  return (
    <ProductDetailSection
      iconSource="tag"
      style={styles.productDetailContainer}
      testID={addTestIdModifier(testID, 'offer_details')}
      sectionCaptioni18nKey="productDetail_offer_details_title">
      <View style={styles.container}>
        {priceAdditionalInfo ? (
          <Text
            style={[textStyles.BodyBold, { color: colors.labelColor }]}
            testID={addTestIdModifier(testID, 'offer_details_priceAdditionalInfo')}>
            {priceAdditionalInfo}
          </Text>
        ) : null}
        {description ? (
          <Text
            style={[textStyles.BodyRegular, { color: colors.labelColor }]}
            testID={addTestIdModifier(testID, 'offer_details_description')}>
            {description}
          </Text>
        ) : null}
      </View>
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
