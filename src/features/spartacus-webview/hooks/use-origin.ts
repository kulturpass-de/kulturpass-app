import { useMemo } from 'react'

export const useOrigin = (url: string) => {
  const origin = useMemo(() => {
    return url.match(/(https:\/\/[^:/\s]+)/)?.[0] ?? url
  }, [url])

  return origin
}
