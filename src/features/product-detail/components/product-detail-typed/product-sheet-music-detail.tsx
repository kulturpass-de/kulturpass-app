import React from 'react'
import { TestId, useTestIdBuilder } from '../../../../services/test-id/test-id'
import { SheetMusicProductDetail } from '../../types/product-detail'
import { ProductDetailEntry } from '../product-detail-entry'
import { ProductDetailSection } from '../product-detail-section'

export type ProductSheetMusicDetailProps = {
  productDetail: SheetMusicProductDetail
  testID: TestId
}

export const ProductSheetMusicDetail: React.FC<ProductSheetMusicDetailProps> = ({ productDetail, testID }) => {
  const { isbn, publisher, arrangement } = productDetail
  const { addTestIdModifier } = useTestIdBuilder()
  const sectionTestID = addTestIdModifier(testID, 'sheetMusic')

  return (
    <ProductDetailSection
      testID={sectionTestID}
      iconSource="music"
      sectionCaptioni18nKey="productDetail_sheetMusic_caption">
      <ProductDetailEntry i18nKey="productDetail_sheetMusic_isbn" value={isbn} />
      {arrangement ? <ProductDetailEntry i18nKey="productDetail_sheetMusic_arrangement" value={arrangement} /> : null}
      {publisher ? <ProductDetailEntry i18nKey="productDetail_sheetMusic_publisher" value={publisher} /> : null}
    </ProductDetailSection>
  )
}
