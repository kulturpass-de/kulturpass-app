import React from 'react'
import { SheetMusicProductDetail } from '../../types/product-detail'
import { ProductDetailEntry } from '../product-detail-entry'
import { ProductDetailSection } from '../product-detail-section'

export type ProductSheetMusicDetailProps = {
  productDetail: SheetMusicProductDetail
}

export const ProductSheetMusicDetail: React.FC<ProductSheetMusicDetailProps> = ({ productDetail }) => {
  const { isbn, publisher, arrangement } = productDetail
  return (
    <ProductDetailSection iconSource="Music" sectionCaptioni18nKey="productDetail_sheetMusic_caption">
      <ProductDetailEntry
        i18nKey="productDetail_sheetMusic_isbn"
        value={isbn}
        valueTestId="productDetail_sheetMusic_isbn_value"
      />
      {arrangement ? (
        <ProductDetailEntry
          i18nKey="productDetail_sheetMusic_arrangement"
          value={arrangement}
          valueTestId="productDetail_sheetMusic_arrangement_value"
        />
      ) : null}
      {publisher ? (
        <ProductDetailEntry
          i18nKey="productDetail_sheetMusic_publisher"
          value={publisher}
          valueTestId="productDetail_sheetMusic_publisher_value"
        />
      ) : null}
    </ProductDetailSection>
  )
}
