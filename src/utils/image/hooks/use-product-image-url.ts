import { useMemo } from 'react'
import { useOrigin } from '../../../features/spartacus-webview/hooks/use-origin'
import { Image } from '../../../services/api/types/commerce/api-types'
import { useEnvironmentConfigurationCommerce } from '../../../services/environment-configuration/hooks/use-environment-configuration'
import { getProductImageUrl } from '../utils'

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
