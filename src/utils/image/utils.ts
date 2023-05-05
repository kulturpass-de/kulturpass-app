import { Image } from '../../services/api/types/commerce/api-types'

export const getProductImageUrl = (images?: Image[], format: 'product' | 'zoom' = 'zoom'): Image | undefined =>
  images?.find(img => img.imageType === 'PRIMARY' && img.format === format)
