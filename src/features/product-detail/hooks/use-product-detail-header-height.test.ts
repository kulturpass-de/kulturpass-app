import { act, renderHook, waitFor } from '@testing-library/react-native'
import { useProductDetailHeaderHeight } from './use-product-detail-header-height'

const HEADER_MAX_HEIGHT = 150
const HEADER_MIN_HEIGHT = 56

describe('useProductDetailHeaderHeight', () => {
  test('Should return initial values', () => {
    const { result } = renderHook(() => useProductDetailHeaderHeight())

    expect(result.current.headerHeightDiff).toEqual(null)
    expect(result.current.headerMaxHeight).toEqual(null)
    expect(result.current.headerMinHeight).toEqual(56)
  })

  test('Should set the max height via callback', async () => {
    const { result } = renderHook(() => useProductDetailHeaderHeight())

    await act(() => {
      result.current.onHeaderSetMaxHeight(HEADER_MAX_HEIGHT)
    })

    await waitFor(() => expect(result.current.headerMaxHeight).toEqual(HEADER_MAX_HEIGHT))
  })

  test('Should calculate the header diff to be max - min height', async () => {
    const { result } = renderHook(() => useProductDetailHeaderHeight())

    await act(() => {
      result.current.onHeaderSetMaxHeight(HEADER_MAX_HEIGHT)
    })

    await waitFor(() => expect(result.current.headerHeightDiff).toEqual(HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT))
  })
})
