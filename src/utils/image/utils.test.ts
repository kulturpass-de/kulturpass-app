import { Image } from '../../services/api/types/commerce/api-types'
import { getThumbnailImageUrl } from './utils'

const thumbnail: Image = {
  imageType: 'PRIMARY',
  format: 'thumbnail',
  altText: 'test',
  galleryIndex: 0,
  url: '/test.png',
}

const notThumbnail: Image = {
  imageType: 'GALLERY',
  format: 'icon',
  altText: 'test',
  galleryIndex: 0,
  url: '/test.png',
}

describe('Image Utils', () => {
  describe('getThumbnailImageUrl', () => {
    test('should return the correct thumbnail', () => {
      const images = [notThumbnail, thumbnail]
      const result = getThumbnailImageUrl(images)

      expect(result?.url).toEqual(thumbnail.url)
    })
    test('should return undefined', () => {
      const images = [notThumbnail]
      const result = getThumbnailImageUrl(images)

      expect(result).toBeUndefined()
    })
  })
})
