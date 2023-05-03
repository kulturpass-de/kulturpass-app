import { ProductDetail } from '../../../../features/product-detail/types/product-detail'

export type GetProductDetailParams = {
  productCode: string
}

export type GetProductDetailResponse = ProductDetail
