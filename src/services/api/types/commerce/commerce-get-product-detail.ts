import { ProductDetail } from '../../../../features/product-detail/types/product-detail'
import { LocationSuggestion } from './commerce-get-location-suggestions'

export type ProviderCityOrPostalCode =
  | { provider: 'postalCode'; postalCode: string }
  | { provider: 'city'; location: LocationSuggestion }

export type GetProductDetailParams = {
  productCode: string
  location?: { provider: 'location' } | ProviderCityOrPostalCode
}

export type GetProductDetailResponse = ProductDetail
