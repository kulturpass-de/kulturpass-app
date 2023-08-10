import { ProductDetail } from '../../../../features/product-detail/types/product-detail'

export type GetProductDetailParams = {
  productCode: string
  location?: { provider: 'location' } | { provider: 'postalCode'; postalCode: string }
}

export type GetProductDetailResponse = ProductDetail
