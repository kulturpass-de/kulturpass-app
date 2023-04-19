import { Image } from '../../services/api/types/commerce/api-types'

export const getThumbnailImageUrl = (images?: Image[]): Image | undefined =>
  images?.find(img => img.imageType === 'PRIMARY' && img.format === 'thumbnail')
