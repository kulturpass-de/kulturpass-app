import React from 'react'
import { ShopAddress } from '../../../services/api/types/commerce/api-types'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { Address } from './address'
import { ProductDetailSection } from './product-detail-section'

export type ProductDetailOfferProps = {
  offerInfo: {
    shopAddress?: ShopAddress
    shopDistance?: number
    shopName?: string
  }
  copyAddressToClipboard?: boolean
  showDistance?: boolean
}

export const ProductDetailOffer: React.FC<ProductDetailOfferProps> = ({
  offerInfo,
  copyAddressToClipboard = false,
  showDistance,
}) => {
  const { buildTestId } = useTestIdBuilder()
  const sectionTestID = buildTestId('productDetail_offer')

  return (
    <ProductDetailSection
      testID={sectionTestID}
      iconSource="Coupon"
      sectionCaptioni18nKey="productDetail_offer_caption">
      <Address
        name={offerInfo.shopName}
        city={offerInfo.shopAddress?.city}
        street={offerInfo.shopAddress?.street}
        postalCode={offerInfo.shopAddress?.postalCode}
        distance={offerInfo.shopDistance}
        showDistance={showDistance}
        showCopyToClipboard={copyAddressToClipboard}
        baseTestId={sectionTestID}
      />
    </ProductDetailSection>
  )
}
