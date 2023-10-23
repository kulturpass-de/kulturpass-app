import { useMemo } from 'react'

export const useOrigin = (url: string) => {
  const origin = useMemo(() => {
    return new URL(url).origin
  }, [url])

  return origin
}
