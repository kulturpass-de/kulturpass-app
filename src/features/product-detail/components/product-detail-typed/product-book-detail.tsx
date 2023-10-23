import React from 'react'
import { TestId, useTestIdBuilder } from '../../../../services/test-id/test-id'
import { useTranslation } from '../../../../services/translation/translation'
import { BookProductDetail } from '../../types/product-detail'
import { ProductDetailEntry } from '../product-detail-entry'
import { ProductDetailSection } from '../product-detail-section'

export type ProductBookDetailProps = {
  productDetail: BookProductDetail
  testID: TestId
}

export const ProductBookDetail: React.FC<ProductBookDetailProps> = ({ productDetail, testID }) => {
  const { isbn, publisher, language, bookFormat } = productDetail
  const { addTestIdModifier } = useTestIdBuilder()
  const sectionTestID = addTestIdModifier(testID, 'book')
  const { t } = useTranslation()

  return (
    <ProductDetailSection testID={sectionTestID} iconSource="book" sectionCaptioni18nKey="productDetail_book_caption">
      <ProductDetailEntry i18nKey="productDetail_book_isbn" value={isbn} />
      <ProductDetailEntry i18nKey="productDetail_book_publisher" value={publisher} />
      {language ? <ProductDetailEntry i18nKey="productDetail_book_language" value={language} /> : null}
      {bookFormat ? (
        <ProductDetailEntry
          i18nKey="productDetail_book_bookFormat"
          value={t(`productDetail_book_bookFormat_${bookFormat}`)}
        />
      ) : null}
    </ProductDetailSection>
  )
}
