import { CompositeScreenProps } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import {
  OnboardingAboutAppRouteName,
  OnboardingAboutAppRouteParams,
} from '../../features/onboarding/screens/onboarding-about-app-route'
import {
  OnboardingLocationPermissionRouteName,
  OnboardingLocationPermissionRouteParams,
} from '../../features/onboarding/screens/onboarding-location-permission-route'

import { OnboardingStackParams } from '../types'

export type OnboardingParamList = {
  [OnboardingAboutAppRouteName]: OnboardingAboutAppRouteParams
  [OnboardingLocationPermissionRouteName]: OnboardingLocationPermissionRouteParams
}

export type OnboardingScreenProps<RouteName extends keyof OnboardingParamList> = CompositeScreenProps<
  StackScreenProps<OnboardingParamList, RouteName>,
  StackScreenProps<OnboardingStackParams>
>
