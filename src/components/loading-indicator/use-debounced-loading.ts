import { useEffect, useState } from 'react'

/**
 * Debounce loading time for `debounceTime` ms
 */
export const useDebouncedLoading = (loading: boolean, debounceTime: number = 150): boolean => {
  const [debouncedLoading, setDebouncedLoading] = useState(false)

  useEffect(() => {
    if (!debounceTime) {
      setDebouncedLoading(loading)
    }

    if (loading) {
      const id = setTimeout(() => setDebouncedLoading(true), debounceTime)
      return () => clearTimeout(id)
    } else {
      setDebouncedLoading(false)
    }
  }, [debounceTime, loading])

  return debouncedLoading
}
