import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useCallback } from 'react'
import { RootStackParams } from '../../../navigation/types'
import { ProductDetailRouteConfig } from '../../product-detail/screens/product-detail-route'

export const useNavigateToPDP = () => {
  const rootNavigation = useNavigation<StackNavigationProp<RootStackParams>>()

  return useCallback(
    (data: { url: string }) => {
      const url = data.url

      const productCode = url.match(/\/product\/([^?/]+)/)?.[1]

      const isRandomMode = url.includes('randomMode=true')

      if (productCode) {
        rootNavigation.navigate('PDP', {
          screen: ProductDetailRouteConfig.name,
          params: {
            productCode: productCode,
            randomMode: isRandomMode,
          },
        })
        return true
      }
    },
    [rootNavigation],
  )
}
