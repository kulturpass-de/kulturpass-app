import { NavigatorScreenParams } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'

import { TabsParamList } from './tabs/types'
import { ModalParamList } from './modal/types'
import { OnboardingParamList } from './onboarding/types'

export type RootStackParams = {
  Tabs: NavigatorScreenParams<TabsParamList> | undefined
  Modal: NavigatorScreenParams<ModalParamList>
}

export type OnboardingStackParams = {
  Onboarding: NavigatorScreenParams<OnboardingParamList>
}

export type RootStackScreenProps<RouteName extends keyof RootStackParams> = StackScreenProps<RootStackParams, RouteName>
