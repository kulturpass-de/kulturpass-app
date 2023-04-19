import React, { useCallback } from 'react'
import { useModalNavigation } from '../../../navigation/modal/hooks'

import { createRouteConfig } from '../../../navigation/utils/createRouteConfig'
import { modalCardStyle } from '../../../theme/utils'
import { OnboardingAboutAppScreen } from './onboarding-about-app-screen'
import { OnboardingLocationPermissionRouteConfig } from './onboarding-location-permission-route'

export const OnboardingAboutAppRouteName = 'OnboardingAboutApp'

export type OnboardingAboutAppRouteParams = undefined

export const OnboardingAboutAppRoute: React.FC = () => {
  const modalNavigation = useModalNavigation()

  const onNext = useCallback(() => {
    modalNavigation.navigate({
      screen: OnboardingLocationPermissionRouteConfig.name,
    })
  }, [modalNavigation])

  return <OnboardingAboutAppScreen onNext={onNext} />
}

export const OnboardingAboutAppRouteConfig = createRouteConfig({
  name: OnboardingAboutAppRouteName,
  component: OnboardingAboutAppRoute,
  options: { cardStyle: modalCardStyle },
})
