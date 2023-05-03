import React from 'react'
import { MusicInstrumentProductDetail } from '../../types/product-detail'
import { ProductDetailEntry } from '../product-detail-entry'
import { ProductDetailSection } from '../product-detail-section'
import { useTestIdBuilder } from '../../../../services/test-id/test-id'

export type ProductMusicInstrumentDetailProps = {
  productDetail: MusicInstrumentProductDetail
}

export const ProductMusicInstrumentDetail: React.FC<ProductMusicInstrumentDetailProps> = ({ productDetail }) => {
  const { manufacturer } = productDetail
  const { buildTestId } = useTestIdBuilder()
  return (
    <>
      {manufacturer ? (
        <ProductDetailSection
          testID={buildTestId('productDetail_musicInstrument')}
          iconSource="Tag"
          sectionCaptioni18nKey="productDetail_musicInstrument_caption">
          <ProductDetailEntry
            i18nKey="productDetail_musicInstrument_manufacturer"
            value={manufacturer}
            valueTestId="productDetail_musicInstrument_manufacturer_value"
          />
        </ProductDetailSection>
      ) : null}
    </>
  )
}
