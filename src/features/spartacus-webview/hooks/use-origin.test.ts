import { renderHook } from '@testing-library/react-native'
import { useOrigin } from './use-origin'

describe('useOrigin', () => {
  test('should extract correct origin', () => {
    const origin = 'https://abcdef.2435-testtest'
    const url = origin + '/search/hello?query=abcdef'
    const { result } = renderHook(() => useOrigin(url))

    expect(result.current).toBe(origin)
  })
})
