import React from 'react'
import { MusicInstrumentProductDetail } from '../../types/product-detail'
import { ProductDetailEntry } from '../product-detail-entry'
import { ProductDetailSection } from '../product-detail-section'

export type ProductMusicInstrumentDetailProps = {
  productDetail: MusicInstrumentProductDetail
}

export const ProductMusicInstrumentDetail: React.FC<ProductMusicInstrumentDetailProps> = ({ productDetail }) => {
  const { manufacturer } = productDetail
  return (
    <>
      {manufacturer ? (
        <ProductDetailSection iconSource="Tag" sectionCaptioni18nKey="productDetail_musicInstrument_caption">
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
