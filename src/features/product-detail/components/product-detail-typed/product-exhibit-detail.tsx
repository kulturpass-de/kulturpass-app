import React from 'react'
import { TestId, useTestIdBuilder } from '../../../../services/test-id/test-id'
import { ExhibitProductDetail } from '../../types/product-detail'
import { ProductDetailVenueSection } from '../product-detail-section/product-detail-venue-section'

export type ProductExhibitDetailProps = {
  productDetail: ExhibitProductDetail
  testID: TestId
  detailType: 'OrderDetail' | 'ProductDetail'
}

export const ProductExhibitDetail: React.FC<ProductExhibitDetailProps> = ({ productDetail, testID, detailType }) => {
  const { addTestIdModifier } = useTestIdBuilder()

  return (
    <ProductDetailVenueSection
      productDetail={productDetail}
      startDate={productDetail.exhibitStartDate}
      endDate={productDetail.exhibitEndDate}
      durationInMins={productDetail.durationInMins}
      testID={addTestIdModifier(testID, 'exhibit')}
      durationCaptionI18nKey="productDetail_exhibit_duration_caption"
      detailType={detailType}
    />
  )
}
