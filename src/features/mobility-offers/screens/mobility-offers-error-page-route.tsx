import { NavigatorScreenParams, useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback } from 'react'
import { ModalScreenProps } from '../../../navigation/modal/types'
import { RootStackParams } from '../../../navigation/types'
import { createRouteConfig } from '../../../navigation/utils/create-route-config'
import { modalCardStyle } from '../../../theme/utils'
import { MobilityCustomError } from '../errors/errors'
import { MobilityOffersErrorPage } from './mobility-offers-error-page'

export const MobilityOffersErrorPageRouteName = 'MobilityOffersErrorPageRoute'

export type MobilityOffersErrorPageRouteParams = {
  error: MobilityCustomError
}

export type MobilityOffersErrorPageRouteStackParams = {
  MobilityOffersErrorPage: NavigatorScreenParams<MobilityOffersErrorPageRouteParams>
}

export type MobilityOffersErrorPageRouteProps = ModalScreenProps<'MobilityOffersErrorPageRoute'>

export const MobilityOffersErrorPageRoute: React.FC<MobilityOffersErrorPageRouteProps> = ({ route }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParams, 'Tabs'>>()
  const onClose = useCallback(() => {
    navigation.popTo('Tabs')
  }, [navigation])

  const { params } = route
  return <>{params?.error && <MobilityOffersErrorPage onClose={onClose} error={params.error} />}</>
}

export const MobilityOffersErrorPageRouteConfig = createRouteConfig({
  name: MobilityOffersErrorPageRouteName,
  component: MobilityOffersErrorPageRoute,
  options: { cardStyle: modalCardStyle },
})
