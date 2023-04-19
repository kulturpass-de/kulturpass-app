import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'

import { createRouteConfig } from '../../../navigation/utils/createRouteConfig'
import { modalCardStyle } from '../../../theme/utils'
import { OnboardingNotificationPermissionScreen } from './onboarding-notification-permission-screen'

export const OnboardingNotificationPermissionRouteName = 'OnboardingNotificationPermission'

export type OnboardingNotificationPermissionRouteParams = undefined

export const OnboardingNotificationPermissionRoute: React.FC = () => {
  //TODO: Add correct type
  const navigation = useNavigation<any>()

  const onNext = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Tabs' }],
    })
  }, [navigation])

  return <OnboardingNotificationPermissionScreen onNext={onNext} />
}

export const OnboardingNotificationPermissionRouteConfig = createRouteConfig({
  name: OnboardingNotificationPermissionRouteName,
  component: OnboardingNotificationPermissionRoute,
  options: { cardStyle: modalCardStyle },
})
