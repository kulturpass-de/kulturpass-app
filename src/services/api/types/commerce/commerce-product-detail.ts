import { GeoPosition } from 'react-native-geolocation-service'
import { ProductDetail } from '../../../../features/product-detail/types/product-detail'

export type GetProductDetailParams = {
  baseSiteId: string
  productCode: string
  language: string
  location?: GeoPosition
  preferredPostalCode?: string
}

export type GetProductDetailResponse = ProductDetail
