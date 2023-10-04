import { CompositeScreenProps } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import {
  OnboardingAboutAppRouteName,
  OnboardingAboutAppRouteParams,
} from '../../screens/app/onboarding/onboarding-about-app-route'
import {
  OnboardingLocationPermissionRouteName,
  OnboardingLocationPermissionRouteParams,
} from '../../screens/app/onboarding/onboarding-location-permission-route'
import {
  OnboardingNotificationPermissionRouteName,
  OnboardingNotificationPermissionRouteParams,
} from '../../screens/app/onboarding/onboarding-notification-permission-route'
import { OnboardingStackParams } from '../types'

export type OnboardingParamList = {
  [OnboardingAboutAppRouteName]: OnboardingAboutAppRouteParams
  [OnboardingLocationPermissionRouteName]: OnboardingLocationPermissionRouteParams
  [OnboardingNotificationPermissionRouteName]: OnboardingNotificationPermissionRouteParams
}

export type OnboardingScreenProps<RouteName extends keyof OnboardingParamList> = CompositeScreenProps<
  StackScreenProps<OnboardingParamList, RouteName>,
  StackScreenProps<OnboardingStackParams>
>
