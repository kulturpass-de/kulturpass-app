import React from 'react'
import { GoToSearchButton } from '../../../../components/go-to-search-button/go-to-search-button'
import { ShopAddress } from '../../../../services/api/types/commerce/api-types'
import { useTestIdBuilder } from '../../../../services/test-id/test-id'
import { Address } from '../address'
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
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const sectionTestID = buildTestId('productDetail_offer')

  const address = (
    <Address
      name={offerInfo.shopName}
      city={offerInfo.shopAddress?.city}
      street={offerInfo.shopAddress?.street}
      postalCode={offerInfo.shopAddress?.postalCode}
      distance={offerInfo.shopDistance}
      showDistance={showDistance}
      showCopyToClipboard={copyAddressToClipboard}
      baseTestId={sectionTestID}
      accessibilityLabelI18nKey="productDetail_offer_copyToClipboard"
      copiedAccessibilityI18nKey="productDetail_offer_copiedToClipboard"
    />
  )
  return (
    <ProductDetailSection
      testID={sectionTestID}
      iconSource="coupon"
      sectionCaptioni18nKey="productDetail_offer_caption">
      {!copyAddressToClipboard ? (
        <GoToSearchButton searchTerm={offerInfo.shopName} testID={addTestIdModifier(sectionTestID, 'button')}>
          {address}
        </GoToSearchButton>
      ) : (
        address
      )}
    </ProductDetailSection>
  )
}
