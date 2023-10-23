import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useCallback } from 'react'
import { RootStackParams } from '../../../navigation/types'
import { POSTAL_CODE_PATTERN } from '../../form-validation/utils/form-validation'
import { ProductDetailRouteConfig } from '../../product-detail/screens/product-detail-route'

export const useNavigateToPDP = () => {
  const rootNavigation = useNavigation<StackNavigationProp<RootStackParams>>()

  return useCallback(
    (data: { url: string }) => {
      const url = data.url

      const searchQuery = url.includes('?') ? url.substring(url.indexOf('?') + 1) : ''
      const searchParams = new URLSearchParams(searchQuery)

      const productCode = url.match(/\/product\/([^?/]+)/)?.[1]

      if (productCode) {
        let postalCode = searchParams.get('postalCode')
        if (postalCode && !POSTAL_CODE_PATTERN.test(postalCode)) {
          postalCode = null
        }

        rootNavigation.navigate('PDP', {
          screen: ProductDetailRouteConfig.name,
          params: {
            productCode: productCode,
            randomMode: searchParams.get('randomMode') === 'true',
            ...(postalCode
              ? {
                  offersByLocation: {
                    provider: 'postalCode',
                    postalCode: postalCode,
                  },
                }
              : {}),
          },
        })
        return true
      }
    },
    [rootNavigation],
  )
}
