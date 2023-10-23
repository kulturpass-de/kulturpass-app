import React from 'react'
import { TestId, useTestIdBuilder } from '../../../../services/test-id/test-id'
import { CulturalWorkshopDetail } from '../../types/product-detail'
import { ProductDetailVenueSection } from '../product-detail-section/product-detail-venue-section'

export type ProductCulturalWorkshopDetailProps = {
  productDetail: CulturalWorkshopDetail
  testID: TestId
  detailType: 'OrderDetail' | 'ProductDetail'
}

export const ProductCulturalWorkshopDetail: React.FC<ProductCulturalWorkshopDetailProps> = ({
  productDetail,
  testID,
  detailType,
}) => {
  const { addTestIdModifier } = useTestIdBuilder()

  return (
    <ProductDetailVenueSection
      productDetail={productDetail}
      startDate={productDetail.eventStartDate}
      endDate={productDetail.eventEndDate}
      testID={addTestIdModifier(testID, 'cultural_workshop')}
      durationCaptionI18nKey="productDetail_cultural_workshop_duration_caption"
      detailType={detailType}
    />
  )
}
