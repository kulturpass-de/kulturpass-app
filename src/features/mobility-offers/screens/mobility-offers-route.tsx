import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { createRouteConfig } from '../../../navigation/utils/create-route-config'
import { MobilityOffersScreen } from './mobility-offers-screen'

export const MobilityOffersRouteName = 'MobilityOffers'

export type MobilityOffersRouteParams = undefined

export const MobilityOffersRoute: React.FC = () => {
  const navigation = useNavigation()

  const modalNavigation = useModalNavigation()
  const navigateToMobilityOffers = useCallback(
    (campaignCode: string) => {
      modalNavigation.navigate({
        screen: 'MobilityOffersProductDetailsRoute',
        params: { campaignCode: campaignCode },
      })
    },
    [modalNavigation],
  )

  const backPress = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  return <MobilityOffersScreen onPressBackButton={backPress} navigateToMobilityOffers={navigateToMobilityOffers} />
}

export const MobilityOffersRouteConfig = createRouteConfig({
  name: MobilityOffersRouteName,
  component: MobilityOffersRoute,
})
