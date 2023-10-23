import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback } from 'react'
import { EidAboutVerificationRouteName } from '../../../features/eid-verification/screens/eid-about-verification-route'
import { RootStackParams } from '../../../navigation/types'
import { createRouteConfig } from '../../../navigation/utils/create-route-config'
import { modalCardStyle } from '../../../theme/utils'
import { RegistrationFinishedScreen } from './registration-finished-screen'

export const RegistrationFinishedRouteName = 'RegistrationFinished'

export type RegistrationFinishedRouteParams = undefined

export const RegistrationFinishedRoute: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParams>>()

  const onNext = useCallback(() => {
    navigation.navigate('Tabs')
    navigation.navigate('Eid', { screen: EidAboutVerificationRouteName })
  }, [navigation])

  const onClose = useCallback(() => {
    navigation.navigate('Tabs')
  }, [navigation])

  return <RegistrationFinishedScreen onNext={onNext} onClose={onClose} />
}

export const RegistrationFinishedRouteConfig = createRouteConfig({
  name: RegistrationFinishedRouteName,
  component: RegistrationFinishedRoute,
  options: { cardStyle: modalCardStyle },
})
