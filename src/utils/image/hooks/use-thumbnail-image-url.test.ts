import { renderHook } from '@testing-library/react-native'
import { Image } from '../../../services/api/types/commerce/api-types'
import { StoreProvider } from '../../../services/testing/test-utils'
import { act } from 'react-test-renderer'
import { useThumbnailImageUrl } from './use-thumbnail-image-url'

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

describe('useThumbnailImageUrl', () => {
  test('should return the full thumbnail image url', async () => {
    const images = [notThumbnail, thumbnail]
    const { result } = renderHook(() => useThumbnailImageUrl(images), {
      wrapper: StoreProvider,
    })
    // Fixes hook not executed => seems to be a problem with redux store mocking and renderHook
    await act(() => {})
    expect(result.current?.imageUrl).toBe('http://localhost/cc/test.png')
  })
})
