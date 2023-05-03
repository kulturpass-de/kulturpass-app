import { renderHook } from '@testing-library/react-native'
import { useDebouncedLoading } from './use-debounced-loading'
import { useState } from 'react'
import { act } from 'react-test-renderer'

describe('useDebouncedLoading', () => {
  test('Should debounce loading', async () => {
    const { result } = renderHook(() => {
      const [loading, setLoading] = useState(false)
      const debouncedLoading = useDebouncedLoading(loading, 500)
      return { debouncedLoading, setLoading }
    })
    expect(result.current.debouncedLoading).toBe(false)
    await act(() => result.current.setLoading(true))
    expect(result.current.debouncedLoading).toBe(false)
    await new Promise(r => setTimeout(r, 1000))
    expect(result.current.debouncedLoading).toBe(true)
  })
})
