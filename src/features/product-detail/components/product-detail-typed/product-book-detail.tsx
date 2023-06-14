import React from 'react'
import { BookProductDetail } from '../../types/product-detail'
import { ProductDetailEntry } from '../product-detail-entry'
import { ProductDetailSection } from '../product-detail-section'
import { TestId, useTestIdBuilder } from '../../../../services/test-id/test-id'

export type ProductBookDetailProps = {
  productDetail: BookProductDetail
  testID: TestId
}

export const ProductBookDetail: React.FC<ProductBookDetailProps> = ({ productDetail, testID }) => {
  const { isbn, publisher, language, bookFormat } = productDetail
  const { addTestIdModifier } = useTestIdBuilder()
  const sectionTestID = addTestIdModifier(testID, 'book')

  return (
    <ProductDetailSection testID={sectionTestID} iconSource="Book" sectionCaptioni18nKey="productDetail_book_caption">
      <ProductDetailEntry i18nKey="productDetail_book_isbn" value={isbn} />
      <ProductDetailEntry i18nKey="productDetail_book_publisher" value={publisher} />
      {language ? <ProductDetailEntry i18nKey="productDetail_book_language" value={language} /> : null}
      {bookFormat ? (
        <ProductDetailEntry
          i18nKey="productDetail_book_bookFormat"
          value={bookFormat} //TODO: Add bookFormat translations
        />
      ) : null}
    </ProductDetailSection>
  )
}
