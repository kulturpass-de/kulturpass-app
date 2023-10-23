import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback } from 'react'
import { OnboardingParamList } from '../../../navigation/onboarding/types'
import { createRouteConfig } from '../../../navigation/utils/create-route-config'
import { modalCardStyle } from '../../../theme/utils'
import { OnboardingLocationPermissionScreen } from './onboarding-location-permission-screen'
import { OnboardingNotificationPermissionRouteName } from './onboarding-notification-permission-route'

export const OnboardingLocationPermissionRouteName = 'OnboardingLocationPermission'

export type OnboardingLocationPermissionRouteParams = undefined

export const OnboardingLocationPermissionRoute: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<OnboardingParamList>>()

  const onNext = useCallback(() => {
    navigation.navigate(OnboardingNotificationPermissionRouteName)
  }, [navigation])

  return <OnboardingLocationPermissionScreen onNext={onNext} />
}

export const OnboardingLocationPermissionRouteConfig = createRouteConfig({
  name: OnboardingLocationPermissionRouteName,
  component: OnboardingLocationPermissionRoute,
  options: { cardStyle: modalCardStyle },
})
