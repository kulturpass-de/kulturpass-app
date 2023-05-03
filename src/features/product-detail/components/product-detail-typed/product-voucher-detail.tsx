import React from 'react'
import { Text } from 'react-native'
import { useTestIdBuilder } from '../../../../services/test-id/test-id'
import { colors } from '../../../../theme/colors'
import { textStyles } from '../../../../theme/typography'
import { VoucherProductDetail } from '../../types/product-detail'
import { ProductDetailSection } from '../product-detail-section'

export type ProductVoucherDetailProps = {
  productDetail: VoucherProductDetail
}

export const ProductVoucherDetail: React.FC<ProductVoucherDetailProps> = ({ productDetail }) => {
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const { voucherPickupPoint } = productDetail
  const testID = buildTestId('productDetail_voucher_pickupPoint')
  return (
    <>
      {voucherPickupPoint ? (
        <ProductDetailSection
          testID={testID}
          iconSource="MapPin"
          sectionCaptioni18nKey="productDetail_voucher_pickupPoint_caption">
          {voucherPickupPoint.name ? (
            <Text style={[textStyles.BodyBlack, { color: colors.moonDarkest }]}>{voucherPickupPoint.name}</Text>
          ) : null}
          <Text
            testID={addTestIdModifier(testID, 'street')}
            style={[textStyles.BodyRegular, { color: colors.moonDarkest }]}>
            {voucherPickupPoint.street}
          </Text>
          <Text
            testID={addTestIdModifier(testID, 'city')}
            style={[textStyles.BodyRegular, { color: colors.moonDarkest }]}>
            {voucherPickupPoint.postalCode} {voucherPickupPoint.city}
          </Text>
        </ProductDetailSection>
      ) : null}
    </>
  )
}
