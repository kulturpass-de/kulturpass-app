import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback } from 'react'
import { useStartVerification } from '../../../features/eid-verification/hooks/use-start-verification'
import { RootStackParams } from '../../../navigation/types'
import { createRouteConfig } from '../../../navigation/utils/create-route-config'
import { modalCardStyle } from '../../../theme/utils'
import { RegistrationFinishedScreen } from './registration-finished-screen'

export const RegistrationFinishedRouteName = 'RegistrationFinished'

export type RegistrationFinishedRouteParams = undefined

export const RegistrationFinishedRoute: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParams>>()

  const startVerification = useStartVerification()

  const onNext = useCallback(() => {
    navigation.popTo('Tabs')
    startVerification()
  }, [navigation, startVerification])

  const onClose = useCallback(() => {
    navigation.popTo('Tabs')
  }, [navigation])

  return <RegistrationFinishedScreen onNext={onNext} onClose={onClose} />
}

export const RegistrationFinishedRouteConfig = createRouteConfig({
  name: RegistrationFinishedRouteName,
  component: RegistrationFinishedRoute,
  options: { cardStyle: modalCardStyle },
})
