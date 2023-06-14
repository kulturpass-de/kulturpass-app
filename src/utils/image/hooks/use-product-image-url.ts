import { useMemo } from 'react'
import { getProductImageUrl } from '../utils'

import { Image } from '../../../services/api/types/commerce/api-types'
import { useOrigin } from '../../../features/spartacus-webview/hooks/use-origin'
import { useEnvironmentConfigurationCommerce } from '../../../services/environment-configuration/hooks/use-environment-configuration'

export const useProductImageUrl = (images?: Image[], format: 'zoom' | 'product' = 'zoom') => {
  const currentCommerceUri = useEnvironmentConfigurationCommerce().baseUrl

  const currentCommerceOrigin = useOrigin(currentCommerceUri)

  const productImage = useMemo(() => {
    return getProductImageUrl(images, format)
  }, [images, format])

  const imageUrl = useMemo(() => {
    const productImageUrl = productImage?.url
    if (productImageUrl !== undefined) {
      return currentCommerceOrigin + productImageUrl
    }
  }, [productImage, currentCommerceOrigin])

  return {
    image: productImage,
    imageUrl,
  }
}
