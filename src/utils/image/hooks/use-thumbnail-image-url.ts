import { useMemo } from 'react'
import { getThumbnailImageUrl } from '../utils'
import { useSelector } from 'react-redux'

import { getCommerceBaseUrl } from '../../../services/environment-configuration/redux/environment-configuration-selectors'
import { Image } from '../../../services/api/types/commerce/api-types'

export const useThumbnailImageUrl = (images?: Image[]) => {
  const currentCommerceUri = useSelector(getCommerceBaseUrl)

  const imageThumbnail = useMemo(() => {
    return getThumbnailImageUrl(images)
  }, [images])

  const imageUrl = useMemo(() => {
    const imageThumbnailUrl = imageThumbnail?.url
    if (imageThumbnailUrl !== undefined) {
      return currentCommerceUri + imageThumbnailUrl
    }
  }, [imageThumbnail, currentCommerceUri])

  return {
    image: imageThumbnail,
    imageUrl,
  }
}
