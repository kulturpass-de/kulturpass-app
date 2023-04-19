import React, { useCallback } from 'react'
import { useModalNavigation } from '../../../navigation/modal/hooks'

import { createRouteConfig } from '../../../navigation/utils/createRouteConfig'
import { modalCardStyle } from '../../../theme/utils'
import { OnboardingLocationPermissionScreen } from './onboarding-location-permission-screen'
import { OnboardingNotificationPermissionRouteConfig } from './onboarding-notification-permission-route'

export const OnboardingLocationPermissionRouteName = 'OnboardingLocationPermission'

export type OnboardingLocationPermissionRouteParams = undefined

export const OnboardingLocationPermissionRoute: React.FC = () => {
  const modalNavigation = useModalNavigation()

  const onNext = useCallback(() => {
    modalNavigation.navigate({
      screen: OnboardingNotificationPermissionRouteConfig.name,
    })
  }, [modalNavigation])

  return <OnboardingLocationPermissionScreen onNext={onNext} />
}

export const OnboardingLocationPermissionRouteConfig = createRouteConfig({
  name: OnboardingLocationPermissionRouteName,
  component: OnboardingLocationPermissionRoute,
  options: { cardStyle: modalCardStyle },
})
