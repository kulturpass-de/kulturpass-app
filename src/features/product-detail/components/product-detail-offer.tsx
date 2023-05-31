import React from 'react'

import { ShopAddress } from '../../../services/api/types/commerce/api-types'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { ProductDetailSection } from './product-detail-section'
import { Address } from './address'

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

  return (
    <>
      <ProductDetailSection
        testID={buildTestId('productDetail_offer')}
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
          baseTestId="productDetail_offer"
        />
      </ProductDetailSection>
    </>
  )
}
