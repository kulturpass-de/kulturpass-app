import React from 'react'
import { TestId, useTestIdBuilder } from '../../../../services/test-id/test-id'
import { MusicInstrumentProductDetail } from '../../types/product-detail'
import { ProductDetailEntry } from '../product-detail-entry'
import { ProductDetailSection } from '../product-detail-section/product-detail-section'

export type ProductMusicInstrumentDetailProps = {
  productDetail: MusicInstrumentProductDetail
  testID: TestId
}

export const ProductMusicInstrumentDetail: React.FC<ProductMusicInstrumentDetailProps> = ({
  productDetail,
  testID,
}) => {
  const { manufacturer, ean } = productDetail
  const { addTestIdModifier } = useTestIdBuilder()
  const sectionTestID = addTestIdModifier(testID, 'musicInstrument')

  return (
    <>
      {manufacturer || ean ? (
        <ProductDetailSection
          testID={sectionTestID}
          iconSource="tag"
          sectionCaptioni18nKey="productDetail_musicInstrument_caption">
          {manufacturer ? (
            <ProductDetailEntry i18nKey="productDetail_musicInstrument_manufacturer" value={manufacturer} />
          ) : null}
          {ean ? <ProductDetailEntry i18nKey="productDetail_musicInstrument_ean" value={ean} /> : null}
        </ProductDetailSection>
      ) : null}
    </>
  )
}
