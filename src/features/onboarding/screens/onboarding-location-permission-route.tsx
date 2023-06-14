import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback } from 'react'

import { RootStackParams } from '../../../navigation/types'
import { createRouteConfig } from '../../../navigation/utils/createRouteConfig'
import { modalCardStyle } from '../../../theme/utils'
import { OnboardingLocationPermissionScreen } from './onboarding-location-permission-screen'

export const OnboardingLocationPermissionRouteName = 'OnboardingLocationPermission'

export type OnboardingLocationPermissionRouteParams = undefined

export const OnboardingLocationPermissionRoute: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParams>>()

  const onNext = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Tabs' }],
    })
  }, [navigation])

  return <OnboardingLocationPermissionScreen onNext={onNext} />
}

export const OnboardingLocationPermissionRouteConfig = createRouteConfig({
  name: OnboardingLocationPermissionRouteName,
  component: OnboardingLocationPermissionRoute,
  options: { cardStyle: modalCardStyle },
})
