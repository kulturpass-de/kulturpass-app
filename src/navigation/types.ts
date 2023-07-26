import { NavigatorScreenParams } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import { EidParamList } from './eid/types'
import { ModalParamList } from './modal/types'
import { OnboardingParamList } from './onboarding/types'
import { TabsParamList } from './tabs/types'

export type RootStackParams = {
  Tabs: NavigatorScreenParams<TabsParamList> | undefined
  Modal: NavigatorScreenParams<ModalParamList>
  Eid: NavigatorScreenParams<EidParamList> | undefined
}

export type OnboardingStackParams = {
  Onboarding: NavigatorScreenParams<OnboardingParamList>
}

export type RootStackScreenProps<RouteName extends keyof RootStackParams> = StackScreenProps<RootStackParams, RouteName>
