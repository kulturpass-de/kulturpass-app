import React, { useCallback } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard'

import { Icon } from '../../../components/icon/icon'
import { Offer } from '../../../services/api/types/commerce/api-types'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { textStyles } from '../../../theme/typography'
import { ProductDetailSection } from './product-detail-section'
import { spacing } from '../../../theme/spacing'
import { colors } from '../../../theme/colors'

export type ProductDetailOfferProps = {
  selectedOffer: Offer
  copyAddressToClipboard?: boolean
  showDistance?: boolean
}

export const ProductDetailOffer: React.FC<ProductDetailOfferProps> = ({
  selectedOffer,
  copyAddressToClipboard = false,
  showDistance,
}) => {
  const { buildTestId } = useTestIdBuilder()
  const { t } = useTranslation()

  // YES, this is formatted correctly
  const copyToClipboard = useCallback(() => {
    Clipboard.setString(`${selectedOffer.shopName}
${selectedOffer.shopAddress?.street}
${selectedOffer.shopAddress?.postalCode} ${selectedOffer.shopAddress?.city}`)
    // TODO: show toast?
  }, [selectedOffer])

  return (
    <>
      <ProductDetailSection iconSource="Coupon" sectionCaptioni18nKey="productDetail_offer_caption">
        <View style={styles.shopName}>
          <Text
            testID={buildTestId('productDetail_offer_name')}
            style={[textStyles.BodyBlack, { color: colors.primaryDark }]}>
            {selectedOffer.shopName}
          </Text>
          {copyAddressToClipboard ? (
            <Pressable
              testID={buildTestId('productDetail_offer_copyToClipboard')}
              accessibilityLabel={t('productDetail_offer_copyToClipboard')}
              onPress={copyToClipboard}>
              <Icon source="Clipboard" width={24} height={24} />
            </Pressable>
          ) : null}
        </View>
        <Text
          testID={buildTestId('productDetail_offer_street')}
          style={[textStyles.BodyRegular, { color: colors.primaryDark }]}>
          {selectedOffer.shopAddress?.street}
        </Text>
        <Text
          testID={buildTestId('productDetail_offer_city')}
          style={[textStyles.BodyRegular, { color: colors.primaryDark }]}>
          {selectedOffer.shopAddress?.postalCode} {selectedOffer.shopAddress?.city}
        </Text>
        {showDistance && selectedOffer.shopDistance ? (
          <Text
            testID={buildTestId('productDetail_offer_distance')}
            style={[textStyles.BodySmallBold, styles.distance]}>
            {t('productDetail_offer_distance', { distance: selectedOffer.shopDistance })}
          </Text>
        ) : null}
      </ProductDetailSection>
    </>
  )
}

const styles = StyleSheet.create({
  shopName: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  distance: {
    paddingTop: spacing[3],
    color: colors.moonDarkest,
  },
})
