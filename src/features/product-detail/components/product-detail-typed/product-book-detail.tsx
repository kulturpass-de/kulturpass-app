import React from 'react'
import { BookProductDetail } from '../../types/product-detail'
import { ProductDetailEntry } from '../product-detail-entry'
import { ProductDetailSection } from '../product-detail-section'
import { useTestIdBuilder } from '../../../../services/test-id/test-id'

export type ProductBookDetailProps = {
  productDetail: BookProductDetail
}

export const ProductBookDetail: React.FC<ProductBookDetailProps> = ({ productDetail }) => {
  const { isbn, publisher, language, bookFormat } = productDetail
  const { buildTestId } = useTestIdBuilder()
  return (
    <ProductDetailSection
      testID={buildTestId('productDetail_book')}
      iconSource="Book"
      sectionCaptioni18nKey="productDetail_book_caption">
      <ProductDetailEntry i18nKey="productDetail_book_isbn" value={isbn} valueTestId="productDetail_book_isbn_value" />
      <ProductDetailEntry
        i18nKey="productDetail_book_publisher"
        value={publisher}
        valueTestId="productDetail_book_publisher_value"
      />
      {language ? (
        <ProductDetailEntry
          i18nKey="productDetail_book_language"
          value={language}
          valueTestId="productDetail_book_language_value"
        />
      ) : null}
      {bookFormat ? (
        <ProductDetailEntry
          i18nKey="productDetail_book_bookFormat"
          value={bookFormat} //TODO: Add bookFormat translations
          valueTestId="productDetail_book_bookFormat_value"
        />
      ) : null}
    </ProductDetailSection>
  )
}
