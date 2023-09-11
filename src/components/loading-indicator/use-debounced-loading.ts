import { useEffect, useRef, useState } from 'react'

/**
 * Debounce loading time for `debounceTime` ms
 */
export const useDebouncedLoading = (loading: boolean, debounceTime: number = 150): boolean => {
  const [debouncedLoading, setDebouncedLoading] = useState(false)

  const isMounted = useRef(true)

  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    if (!debounceTime) {
      setDebouncedLoading(loading)
    }

    if (loading) {
      const id = setTimeout(() => {
        if (isMounted.current) {
          setDebouncedLoading(true)
        }
      }, debounceTime)
      return () => clearTimeout(id)
    } else {
      setDebouncedLoading(false)
    }
  }, [debounceTime, loading])

  return debouncedLoading
}
