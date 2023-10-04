import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Buffer } from 'buffer'
import { useCallback } from 'react'
import { z } from 'zod'
import { RootStackParams } from '../../../navigation/types'
import {
  ProductDetailRouteConfig,
  ProductDetailRouteParams,
} from '../../../screens/product-details/product-detail-route'
import { POSTAL_CODE_PATTERN } from '../../form-validation/utils/form-validation'

const CoordinatesSchema = z.string().transform(coordinatesStr => {
  return coordinatesStr.split(',').map(v => parseFloat(v)) as [number, number]
})

const LocationSchema = z.object({
  id: z.string(),
  name: z.string(),
  coordinates: CoordinatesSchema,
})

export const LocationQueryParamSchema = z.string().transform(base64Encoded => {
  const jsonStr = Buffer.from(base64Encoded, 'base64url').toString()
  return LocationSchema.parse(JSON.parse(jsonStr))
})

export type LocationQueryParam = z.infer<typeof LocationQueryParamSchema>

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
        let location: LocationQueryParam | null = null
        if (locationQueryParam) {
          const result = LocationQueryParamSchema.safeParse(location)
          if (result.success) {
            location = result.data
          }
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
