import { useCallback, useMemo, useState } from 'react'

const PRODUCT_DETAIL_HEADER_MIN_HEIGHT = 56

export type UseProductDetailHeaderHeightReturnType = {
  headerMinHeight: number
  headerMaxHeight: number | null
  headerHeightDiff: number | null
  onHeaderSetMaxHeight: (newHeight: number) => void
}

export const useProductDetailHeaderHeight = (): UseProductDetailHeaderHeightReturnType => {
  const [headerMaxHeight, setHeaderMaxHeight] =
    useState<UseProductDetailHeaderHeightReturnType['headerMaxHeight']>(null)

  const onHeaderSetMaxHeight = useCallback<UseProductDetailHeaderHeightReturnType['onHeaderSetMaxHeight']>(
    newHeight => {
      setHeaderMaxHeight(newHeight)
    },
    [],
  )

  const headerHeightDiff: UseProductDetailHeaderHeightReturnType['headerHeightDiff'] = useMemo(
    () => (headerMaxHeight === null ? null : headerMaxHeight - PRODUCT_DETAIL_HEADER_MIN_HEIGHT),
    [headerMaxHeight],
  )

  return {
    headerMinHeight: PRODUCT_DETAIL_HEADER_MIN_HEIGHT, // for consistency, even though it is a constant
    headerMaxHeight,
    headerHeightDiff,
    onHeaderSetMaxHeight,
  }
}
