import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { z } from 'zod'
import { RootStackParams } from '../../../navigation/types'
import { getIsUserLoggedIn } from '../../../services/auth/store/auth-selectors'
import { useEnvironmentConfigurationCommerce } from '../../../services/environment-configuration/hooks/use-environment-configuration'
import { ErrorAlertManager } from '../../../services/errors/error-alert-provider'
import { UserNotLoggedIn } from '../../mobility-offers/errors/errors'
import { MobilityOffersProductDetailsRouteName } from '../../mobility-offers/screens/mobility-offers-product-details-route'

export const useNavigateToMobility = () => {
  const rootNavigation = useNavigation<StackNavigationProp<RootStackParams>>()
  const { baseUrl } = useEnvironmentConfigurationCommerce()
  const isLoggedIn = useSelector(getIsUserLoggedIn)

  return useCallback(
    (data: { url: string }) => {
      try {
        const url = data.url
        const fullUrl = new URL(url, baseUrl)
        const UrlSchema = z.string().url()
        const isValidUrl = UrlSchema.safeParse(fullUrl.toString()).success
        if (!isValidUrl) {
          return false
        }
        const pathname = fullUrl.pathname
        const pathSegments = pathname.split('/')
        const campaignCode = pathSegments.length > 3 ? pathSegments[3] : null

        if (campaignCode) {
          if (!isLoggedIn) {
            ErrorAlertManager.current?.showError(new UserNotLoggedIn())
            return true
          }

          rootNavigation.navigate('Modal', {
            screen: MobilityOffersProductDetailsRouteName,
            params: { campaignCode },
          })
          return true
        } else {
          return false
        }
      } catch (error) {
        return false
      }
    },
    [baseUrl, isLoggedIn, rootNavigation],
  )
}
