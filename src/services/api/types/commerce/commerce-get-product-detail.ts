import { ProductDetail } from '../../../../features/product-detail/types/product-detail'

export type ProviderCityOrPostalCode =
  | { provider: 'postalCode'; postalCode: string }
  | { provider: 'city'; location: { id: string; name: string; coordinates: [number, number] } }

export type GetProductDetailParams = {
  productCode: string
  location?: { provider: 'location' } | ProviderCityOrPostalCode
}

export type GetProductDetailResponse = ProductDetail
