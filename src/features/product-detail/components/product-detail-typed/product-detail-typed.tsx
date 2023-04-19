import React from 'react'
import { ProductDetail, ProductTypes } from '../../types/product-detail'
import { ProductAudioDetail } from './product-audio-detail'
import { ProductBookDetail } from './product-book-detail'
import { ProductExhibitDetail } from './product-exhibit-detail'
import { ProductMusicInstrumentDetail } from './product-music-instrument-detail'
import { ProductSheetMusicDetail } from './product-sheet-music-detail'
import { ProductStagedEventDetail } from './product-staged-event-detail'
import { ProductVideoDetail } from './product-video-detail'
import { ProductVoucherDetail } from './product-voucher-detail'

export type ProductDetailTypedProps = {
  productDetail: ProductDetail
}

export const ProductDetailTyped: React.FC<ProductDetailTypedProps> = ({ productDetail }) => {
  switch (productDetail.productType) {
    case ProductTypes.Book:
      return <ProductBookDetail productDetail={productDetail} />
    case ProductTypes.StagedEvent:
      return <ProductStagedEventDetail productDetail={productDetail} />
    case ProductTypes.Exhibit:
      return <ProductExhibitDetail productDetail={productDetail} />
    case ProductTypes.Audio:
      return <ProductAudioDetail productDetail={productDetail} />
    case ProductTypes.Video:
      return <ProductVideoDetail productDetail={productDetail} />
    case ProductTypes.SheetMusic:
      return <ProductSheetMusicDetail productDetail={productDetail} />
    case ProductTypes.MusicInstrument:
      return <ProductMusicInstrumentDetail productDetail={productDetail} />
    case ProductTypes.Voucher:
      return <ProductVoucherDetail productDetail={productDetail} />
  }

  return null
}
