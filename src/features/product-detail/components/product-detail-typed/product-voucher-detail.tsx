import React, { useMemo } from 'react'
import { GoToSearchButton } from '../../../../components/go-to-search-button/go-to-search-button'
import { TestId, useTestIdBuilder } from '../../../../services/test-id/test-id'
import { VoucherProductDetail } from '../../types/product-detail'
import { Address } from '../address'
import { ProductDetailSection } from '../product-detail-section'
import { ProductCinemaDetail } from './product-cinema-detail'

export type ProductVoucherDetailProps = {
  productDetail: VoucherProductDetail
  testID: TestId
  detailType: 'OrderDetail' | 'ProductDetail'
}

export const ProductVoucherDetail: React.FC<ProductVoucherDetailProps> = ({ productDetail, testID, detailType }) => {
  const { addTestIdModifier } = useTestIdBuilder()
  const { voucherPickupPoint, venueDistance, categories } = productDetail
  const sectionTestID = addTestIdModifier(testID, 'voucher_pickupPoint')

  const isCinemaVoucherType = useMemo(
    () => categories?.some(category => category?.code === 'couponsCinema'),
    [categories],
  )

  if (
    voucherPickupPoint === undefined ||
    (voucherPickupPoint.city === undefined &&
      voucherPickupPoint.name === undefined &&
      voucherPickupPoint.postalCode === undefined &&
      voucherPickupPoint.street === undefined)
  ) {
    return null
  }

  const address = (
    <Address
      name={voucherPickupPoint.name}
      city={voucherPickupPoint.city}
      street={voucherPickupPoint.street}
      postalCode={voucherPickupPoint.postalCode}
      distance={venueDistance}
      showDistance
      showCopyToClipboard={detailType === 'OrderDetail'}
      baseTestId={sectionTestID}
      copyToClipboardAccessibilityI18nKey="productDetail_voucher_copyToClipboard"
    />
  )

  return (
    <>
      <ProductDetailSection
        testID={sectionTestID}
        iconSource="map-pin"
        sectionCaptioni18nKey="productDetail_voucher_pickupPoint_caption">
        {detailType !== 'OrderDetail' ? (
          <GoToSearchButton
            searchTerm={voucherPickupPoint.name}
            testID={addTestIdModifier(sectionTestID, 'pickupPoint_button')}>
            {address}
          </GoToSearchButton>
        ) : (
          address
        )}
      </ProductDetailSection>
      {isCinemaVoucherType ? <ProductCinemaDetail testID={sectionTestID} productDetail={productDetail} /> : null}
    </>
  )
}
