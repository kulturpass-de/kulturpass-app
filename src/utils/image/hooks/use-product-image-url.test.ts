import { renderHook } from '@testing-library/react-native'
import { Image } from '../../../services/api/types/commerce/api-types'
import { StoreProvider } from '../../../services/testing/test-utils'
import { useProductImageUrl } from './use-product-image-url'

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

describe('useProductImageUrl', () => {
  test('should return the zoom format product image url', async () => {
    const images = [notProductImageUrl, productMediumQualityImageUrl, productHighQualityImageUrl]
    const { result } = renderHook(() => useProductImageUrl(images, 'zoom'), {
      wrapper: StoreProvider,
    })

    expect(result.current?.imageUrl).toBe('http://localhost/zoom.png')
    expect(result.current?.image?.altText).toBe('zoom')
  })

  test('should return the product format product image url', async () => {
    const images = [notProductImageUrl, productMediumQualityImageUrl, productHighQualityImageUrl]
    const { result } = renderHook(() => useProductImageUrl(images, 'product'), {
      wrapper: StoreProvider,
    })

    expect(result.current?.imageUrl).toBe('http://localhost/product.png')
    expect(result.current?.image?.altText).toBe('product')
  })

  test('should return no product image url', async () => {
    const images = [notProductImageUrl, productHighQualityImageUrl]
    const { result } = renderHook(() => useProductImageUrl(images, 'product'), {
      wrapper: StoreProvider,
    })

    expect(result.current.image).toBeUndefined()
    expect(result.current.imageUrl).toBeUndefined()
  })
})
