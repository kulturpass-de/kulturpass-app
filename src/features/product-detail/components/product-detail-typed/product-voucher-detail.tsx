import React from 'react'
import { TestId, useTestIdBuilder } from '../../../../services/test-id/test-id'
import { VoucherProductDetail } from '../../types/product-detail'
import { ProductDetailSection } from '../product-detail-section'
import { Address } from '../address'

export type ProductVoucherDetailProps = {
  productDetail: VoucherProductDetail
  testID: TestId
}

export const ProductVoucherDetail: React.FC<ProductVoucherDetailProps> = ({ productDetail, testID }) => {
  const { addTestIdModifier } = useTestIdBuilder()
  const { voucherPickupPoint, venueDistance } = productDetail
  const sectionTestID = addTestIdModifier(testID, 'voucher_pickupPoint')

  if (
    voucherPickupPoint === undefined ||
    (voucherPickupPoint.city === undefined &&
      voucherPickupPoint.name === undefined &&
      voucherPickupPoint.postalCode === undefined &&
      voucherPickupPoint.street === undefined)
  ) {
    return null
  }

  return (
    <ProductDetailSection
      testID={sectionTestID}
      iconSource="MapPin"
      sectionCaptioni18nKey="productDetail_voucher_pickupPoint_caption">
      <Address
        name={voucherPickupPoint.name}
        city={voucherPickupPoint.city}
        street={voucherPickupPoint.street}
        postalCode={voucherPickupPoint.postalCode}
        distance={venueDistance}
        showDistance
        showCopyToClipboard
        baseTestId={sectionTestID}
      />
    </ProductDetailSection>
  )
}
