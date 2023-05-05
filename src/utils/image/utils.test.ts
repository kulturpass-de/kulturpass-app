import { Image } from '../../services/api/types/commerce/api-types'
import { getProductImageUrl } from './utils'

const productHighQualityImageUrl: Image = {
  imageType: 'PRIMARY',
  format: 'zoom',
  altText: 'zoom',
  galleryIndex: 0,
  url: '/zoom.png',
}

const productMediumQualityImageUrl: Image = {
  imageType: 'PRIMARY',
  format: 'product',
  altText: 'product',
  galleryIndex: 0,
  url: '/product.png',
}

const notProductImageUrl: Image = {
  imageType: 'GALLERY',
  format: 'icon',
  altText: 'noImg',
  galleryIndex: 0,
  url: '/noImg.png',
}

describe('Image Utils', () => {
  describe('getProductImageUrl', () => {
    test('should return the zoom format image url', () => {
      const images = [notProductImageUrl, productMediumQualityImageUrl, productHighQualityImageUrl]
      const result = getProductImageUrl(images, 'zoom')

      expect(result?.url).toEqual(productHighQualityImageUrl.url)
    })

    test('should return the product format image url', () => {
      const images = [notProductImageUrl, productMediumQualityImageUrl, productHighQualityImageUrl]
      const result = getProductImageUrl(images, 'product')

      expect(result?.url).toEqual(productMediumQualityImageUrl.url)
    })

    test('should return undefined', () => {
      const images = [notProductImageUrl]
      const result = getProductImageUrl(images)

      expect(result).toBeUndefined()
    })
  })
})
