import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback } from 'react'
import { OnboardingParamList } from '../../../navigation/onboarding/types'
import { createRouteConfig } from '../../../navigation/utils/createRouteConfig'
import { modalCardStyle } from '../../../theme/utils'
import { OnboardingAboutAppScreen } from './onboarding-about-app-screen'
import { OnboardingLocationPermissionRouteConfig } from './onboarding-location-permission-route'

export const OnboardingAboutAppRouteName = 'OnboardingAboutApp'

export type OnboardingAboutAppRouteParams = undefined

export const OnboardingAboutAppRoute: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<OnboardingParamList>>()

  const onNext = useCallback(() => {
    navigation.navigate(OnboardingLocationPermissionRouteConfig.name)
  }, [navigation])

  return <OnboardingAboutAppScreen onNext={onNext} />
}

export const OnboardingAboutAppRouteConfig = createRouteConfig({
  name: OnboardingAboutAppRouteName,
  component: OnboardingAboutAppRoute,
  options: { cardStyle: modalCardStyle },
})
