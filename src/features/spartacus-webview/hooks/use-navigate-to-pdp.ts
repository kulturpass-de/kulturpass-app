import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useCallback } from 'react'
import { RootStackParams } from '../../../navigation/types'
import {
  ProductDetailRouteConfig,
  ProductDetailRouteParams,
} from '../../../screens/product-details/product-detail-route'
import { POSTAL_CODE_PATTERN } from '../../form-validation/utils/form-validation'
import { LocationQueryParam, parseBaseUrl64Location } from '../utils'

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

        const locationQueryParam = searchParams.get('location')
        let location: Required<LocationQueryParam> | null = null
        if (locationQueryParam) {
          location = parseBaseUrl64Location(locationQueryParam)
        }

        let params: ProductDetailRouteParams = {
          productCode: productCode,
          randomMode: searchParams.get('randomMode') === 'true',
        }

        if (location) {
          params = {
            ...params,
            offersByLocation: {
              provider: 'city',
              location,
            },
          }
        } else if (postalCode) {
          params = {
            ...params,
            offersByLocation: {
              provider: 'postalCode',
              postalCode,
            },
          }
        }

        rootNavigation.navigate('PDP', {
          screen: ProductDetailRouteConfig.name,
          params,
        })
        return true
      }
    },
    [rootNavigation],
  )
}
