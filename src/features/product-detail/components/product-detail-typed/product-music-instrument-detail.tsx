import React from 'react'
import { MusicInstrumentProductDetail } from '../../types/product-detail'
import { ProductDetailEntry } from '../product-detail-entry'
import { ProductDetailSection } from '../product-detail-section'
import { TestId, useTestIdBuilder } from '../../../../services/test-id/test-id'

export type ProductMusicInstrumentDetailProps = {
  productDetail: MusicInstrumentProductDetail
  testID: TestId
}

export const ProductMusicInstrumentDetail: React.FC<ProductMusicInstrumentDetailProps> = ({
  productDetail,
  testID,
}) => {
  const { manufacturer } = productDetail
  const { addTestIdModifier } = useTestIdBuilder()
  const sectionTestID = addTestIdModifier(testID, 'musicInstrument')

  return (
    <>
      {manufacturer ? (
        <ProductDetailSection
          testID={sectionTestID}
          iconSource="Tag"
          sectionCaptioni18nKey="productDetail_musicInstrument_caption">
          <ProductDetailEntry i18nKey="productDetail_musicInstrument_manufacturer" value={manufacturer} />
        </ProductDetailSection>
      ) : null}
    </>
  )
}
