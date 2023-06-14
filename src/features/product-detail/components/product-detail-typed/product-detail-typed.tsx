import React from 'react'
import { ProductDetail, ProductTypes } from '../../types/product-detail'
import { ProductAudioDetail } from './product-audio-detail'
import { ProductBookDetail } from './product-book-detail'
import { ProductExhibitDetail } from './product-exhibit-detail'
import { ProductMusicInstrumentDetail } from './product-music-instrument-detail'
import { ProductSheetMusicDetail } from './product-sheet-music-detail'
import { ProductStagedEventDetail } from './product-staged-event-detail'
import { ProductVoucherDetail } from './product-voucher-detail'
import { useTestIdBuilder } from '../../../../services/test-id/test-id'

export type ProductDetailTypedProps = {
  productDetail: ProductDetail
}

export const ProductDetailTyped: React.FC<ProductDetailTypedProps> = ({ productDetail }) => {
  const { buildTestId } = useTestIdBuilder()
  const testID = buildTestId('productDetail')

  switch (productDetail.productType) {
    case ProductTypes.Book:
      return <ProductBookDetail productDetail={productDetail} testID={testID} />
    case ProductTypes.StagedEvent:
      return <ProductStagedEventDetail productDetail={productDetail} testID={testID} />
    case ProductTypes.Exhibit:
      return <ProductExhibitDetail productDetail={productDetail} testID={testID} />
    case ProductTypes.Audio:
      return <ProductAudioDetail productDetail={productDetail} testID={testID} />
    case ProductTypes.SheetMusic:
      return <ProductSheetMusicDetail productDetail={productDetail} testID={testID} />
    case ProductTypes.MusicInstrument:
      return <ProductMusicInstrumentDetail productDetail={productDetail} testID={testID} />
    case ProductTypes.Voucher:
      return <ProductVoucherDetail productDetail={productDetail} testID={testID} />
  }

  return null
}
